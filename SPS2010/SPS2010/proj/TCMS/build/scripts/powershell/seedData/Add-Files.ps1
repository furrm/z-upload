Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-Files()
{
	<#
		.Example
			Add-Files -Url "http://ddvm9093-sps1" -ListName "TCMS - Graphics" -DestinationFolderName "Resources" -ImagePath "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\Resources" -CommonScriptWorkingDirectory "S:\ao_dev\SPS2010-MASTER-FURRM\common\MAIN\build\scripts\powershell\FarmInstall"
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
		$ImagePath,
		[Parameter(Mandatory=$true, Position=4)]
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
		Write-Output "Url: $Url"
		Write-Output "ListName: $ListName"
		Write-Output "DestinationFolderName: $DestinationFolderName"
		Write-Output "ImagePath: $ImagePath"
		Write-Output "CommonScriptWorkingDirectory: $CommonScriptWorkingDirectory"
#		Write-Output "ChangeReferenceNumber: $ChangeReferenceNumber"
		#END DEBUG
		
		$web = Get-SPWeb $Url
		$changeReferenceItem = $null

	}
	
	process {

		# GET THE CHANGE REFERENCE ITEM
		Set-Location $CommonScriptWorkingDirectory
		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
#		$changeReferenceItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val $ChangeReferenceNumber
		$changeReferenceItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "RI0"
		
		if($changeReferenceItem -ne $null)
		{
			Write-Output "`t Change Item Found..."
			
			# GET URL OF THE DESTINATION FOLDER
			$list =  $web.Lists[$ListName]
			
			# GET THE DETINATION FOLDER URL
			$destinationFolderUrl = $list.RootFolder.Name + "/" + $DestinationFolderName
			
			Write-Output "`t Destination folder URL: $destinationFolderUrl"
			
			# GET THE SPFOLDER OBJECT
			$destinationFolder = $web.GetFolder($destinationFolderUrl)
			
			if($destinationFolder -ne $null)
			{
				Write-Output "`t Destination Folder Found..."
				
				# GET THE FILE COLLECTION
				$destinationFolderFileCollection = $destinationFolder.Files
				
				Write-Output "`t Start Loading Files From $ImagePath..."
				
				$sourceFileCollection = Get-ChildItem -Path $ImagePath
				$fileCount = $sourceFileCollection.Count.ToString()
				Write-Output "`t $fileCount files to process..."
				
				foreach($file in $sourceFileCollection)
				{
					$sourceFileName = $file.Name
					$sourceFullFilePath = $ImagePath + "\" + $sourceFileName					
					
					# ADD THE FILE TO THE FILE COLLECTION
					$destinationFile = $destinationFolderFileCollection.Add($sourceFileName, $file.OpenRead(), $true)
					
					#  UPDATE THE LIST ITEM OF THE DESTINATION FILE WITH THE CHANGE REFERENCE NUMBER
					
					$destinationFileListItem = $destinationFile.Item
					$destinationFileListItem["ChangeRecordRef"] = $changeReferenceItem.ID.ToString() + ";#" + $changeReferenceItem.Title
					$destinationFileListItem.Update()
					
					# CHECKIN THE FILE
					$destinationFile.CheckIn($sourceFileName, [Microsoft.SharePoint.SPCheckinType]::MajorCheckIn)
					
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
			
		}
	}
	end {
		$changeReferenceItem = $null
		$web.Dispose()
		$web = $null
	}
}