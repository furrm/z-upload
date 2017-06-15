Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-WordTemplates()
{
	<#
		.Example
			Add-WordTemplates -Url "http://ddvm9093-sps1" -ListName "TCMS - Templates" -DestinationFolderName "Word" -TemplatePath "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\Word" -DocumentTypes "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\TemplateTypes.csv" -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
			#>
	param (
		[Parameter(Mandatory=$true, Position=0)]
		[String]
		$Url,
		[Parameter(Mandatory=$true, Position=1)]
		[String]
		$ListName,
		[Parameter(Mandatory=$true, Position=2)]
		[String]
		$DestinationFolderName,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$TemplatePath,
		[Parameter(Mandatory=$true, Position=4)]
		[Array]
		$DocumentTypes,
		[Parameter(Mandatory=$true, Position=5)]
		[String]
		$CommonScriptWorkingDirectory
#		,
#		[Parameter(Mandatory=$true, Position=4)]
#		[String]
#		$ChangeReferenceNumber
		
		#S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\Resources
	)
	
	begin {
		#START DEBUG
#		Write-Output "Url: $Url"
#		Write-Output "ListName: $ListName"
#		Write-Output "DestinationFolderName: $DestinationFolderName"
#		Write-Output "TemplatePath: $TemplatePath"
#		Write-Output "CommonScriptWorkingDirectory: $CommonScriptWorkingDirectory"
#		Write-Output "ChangeReferenceNumber: $ChangeReferenceNumber"
		#END DEBUG
		
		Set-Location $CommonScriptWorkingDirectory
		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
		$web = Get-SPWeb $Url
		$changeReferenceItem = $null

	}
	
	process {
		
#		$changeReferenceItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val $ChangeReferenceNumber
#		$changeReferenceItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "RI0"
	
#		if($changeReferenceItem -ne $null)
#		{
#			Write-Output "`t Change Item Found..."
			
			# GET URL OF THE DESTINATION FOLDER
			$library =  $web.Lists[$ListName]
			
			# GET THE DETINATION FOLDER URL
			$destinationFolderUrl = $library.RootFolder.Name + "/" + $DestinationFolderName
			
			Write-Output "`t Destination folder URL: $destinationFolderUrl"
			
			# GET THE SPFOLDER OBJECT
			$destinationFolder = $web.GetFolder($destinationFolderUrl)
			
			if($destinationFolder -ne $null)
			{
				Write-Output "`t Destination Folder Found..."
				
				# GET THE FILE COLLECTION
				$destinationFolderFileCollection = $destinationFolder.Files
				
				Write-Output "`t Start Loading Files From $TemplatePath..."
				
				$sourceFileCollection = Get-ChildItem -Path $TemplatePath
				$fileCount = $sourceFileCollection.Count.ToString()
				Write-Output "`t $fileCount files to process..."
				
				foreach($file in $sourceFileCollection)
				{
					$sourceFileName = $file.Name
					$sourceFullFilePath = $TemplatePath + "\" + $sourceFileName					
					
					# ADD THE FILE TO THE FILE COLLECTION
					$destinationFile = $destinationFolderFileCollection.Add($sourceFileName, $file.OpenRead(), $true)
					
					
					# GET THE DOCUMENTTYPE FOR WORD TEMPLATE

					$multientry = New-Object Microsoft.Sharepoint.SPFieldLookupValueCollection($null)

					foreach($doctype in $DocumentTypes)
					{
						#Write-Output $sourceFileName $doctype
						try
						{
							if ($doctype.TemplateFileName -eq $sourceFileName)
							{
								$li = Get-ListItemByKeyVal -Url $Url -ListName "Document Type"  -Key "Title" -Val $doctype.DocumentType
								$documentTypesValue =  $li.ID.ToString() + ";#" + $li.Title + "; "
								$lookupentry = New-Object Microsoft.Sharepoint.SPFieldLookupValue($documentTypesValue)
								$multientry.Add($lookupentry)
							}
						}
						catch [System.Exception]
						{
							#Write-Output "Error: $doctype"
						}
						
					}
					
					
					# UPDATE THE LIST ITEM OF THE DESTINATION FILE WITH THE CHANGE REFERENCE NUMBER
					$name = $sourceFileName.split(".")
					$destinationFileListItem = $destinationFile.Item
					$destinationFileListItem["Title"] = $name[0] 
					$destinationFileListItem["DocumentType"] = $multientry
					$destinationFileListItem["TemplateCRR"] = "RI0"
					$destinationFileListItem.Update()
					
					# CHECKIN THE FILE
					$destinationFile.CheckIn($sourceFileName, [Microsoft.SharePoint.SPCheckinType]::MajorCheckIn)
					
					$li = $null
					$documentTypesValue = $null
					$lookupentry = $null
					$multientry = $null
					$name = $null
					$sourceFileName = $null
					$sourceFullFilePath = $null
					$destinationFile = $null
					$destinationFileListItem = $null
					$file = $null
				}
				
				$destinationFolderFileCollection = $null
				$sourceFileCollection = $null
				$fileCount = $null
				
				Write-Output "`t Loading Of Files Completed..."
			}
			
			$library = $null
			$destinationFolderUrl = $null
			$destinationFolder = $null
			
#		}
	}
	end {
		$changeReferenceItem = $null
		$web.Dispose()
		$web = $null
	}
}
