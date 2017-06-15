Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-Templates()
{
	<#
		.Example
			Add-Templates -Url "http://ddvm9093-sps1" -ListName "TCMS - Templates" -DestinationFolderName "Excel" -TemplatePath "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\Excel"
		.Example
			Add-Templates -Url "http://ddvm9093-sps1" -ListName "TCMS - Templates" -DestinationFolderName "PowerPoint" -TemplatePath "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\PowerPoint"
		.Example
			Add-Templates -Url "http://ddvm9093-sps1" -ListName "TCMS - Templates" -DestinationFolderName "WordAddins" -TemplatePath "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\WordAddins"
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
		$TemplatePath
#		,
#		[Parameter(Mandatory=$true, Position=4)]
#		[String]
#		$CommonScriptWorkingDirectory
#		,
#		[Parameter(Mandatory=$true, Position=4)]
#		[String]
#		$ChangeReferenceNumber
		
		#S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\Resources
	)
	
	begin {
		#START DEBUG
		Write-Output "Url: $Url"
		Write-Output "ListName: $ListName"
		Write-Output "DestinationFolderName: $DestinationFolderName"
		Write-Output "TemplatePath: $TemplatePath"
#		Write-Output "CommonScriptWorkingDirectory: $CommonScriptWorkingDirectory"
#		Write-Output "ChangeReferenceNumber: $ChangeReferenceNumber"
		#END DEBUG
		
		$web = Get-SPWeb $Url
		$changeReferenceItem = $null

	}
	
	process {

		# GET THE CHANGE REFERENCE ITEM
#		Set-Location $CommonScriptWorkingDirectory
#		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
#		$changeReferenceItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val $ChangeReferenceNumber
#		$changeReferenceItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "RI0"
		
#		if($changeReferenceItem -ne $null)
#		{
#			Write-Output "`t Change Item Found..."
			
			# GET URL OF THE DESTINATION FOLDER
			$list =  $web.Lists[$ListName]
			
			# GET THE DESTINATION FOLDER URL
			$destinationFolderUrl = $list.RootFolder.Name + "/" + $DestinationFolderName
			
			Write-Output "`t Destination folder URL: $destinationFolderUrl"
			
			# GET THE SPFOLDER OBJECT
			$destinationFolder = $web.GetFolder($destinationFolderUrl)
			
			if($destinationFolder -ne $null)
			{
				Write-Output "`t Destination Folder Found..."
				
				# SPECIFIC USE CASE FOR WORD ADDINS
#				if($DestinationFolderName = "WordAddins")
#				{
#					# Get the Document Type "Document|Document"
#					Write-Output "`t Getting item Document|Document from the Document Type list...";
#					$DocumentTypeItem = Get-ListItemByKeyVal -Url $Url -ListName "Document Type" -Key "Title" -Val "Document|Document";
#				}
				
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
					
					#  UPDATE THE LIST ITEM OF THE DESTINATION FILE WITH THE CHANGE REFERENCE NUMBER
					
					$name = $sourceFileName.split(".")
					$destinationFileListItem = $destinationFile.Item
					$destinationFileListItem["Title"] = $name[0] 
					$destinationFileListItem["TemplateCRR"] = "RI0"
					
					# SPECIFIC USE CASE FOR WORD ADDINS
#					if($DestinationFolderName = "WordAddins")
#					{
#						if($DocumentTypeItem -ne $null)
#						{
#							$destinationFileListItem["DocumentType"] = ($DocumentTypeItem.ID.ToString() + ";#" + $DocumentTypeItem.Title); #"6;#Document|Document"
#						}	
#					}
					
					$destinationFileListItem.Update()
					
					# CHECKIN THE FILE
					$destinationFile.CheckIn($sourceFileName, [Microsoft.SharePoint.SPCheckinType]::MajorCheckIn)
					
					#$destinationFile.CheckOut();
					#$destinationFileListItem.Update()
					
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
			
			$list = $null
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