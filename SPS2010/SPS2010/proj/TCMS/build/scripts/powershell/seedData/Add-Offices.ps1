Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-Offices()
{
	<#
		.Example
			Add-Offices -ListName "Office" -Url "http://ddvm9093-sps1" -Offices (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\Offices.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
	#>
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[String]
		$Url,
		[Parameter(Mandatory=$true, Position=1)]
		[String]
		$ListName,
		[Parameter(Mandatory=$true, Position=2)]
		[array]
		$Offices,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
#		#START DEBUG
#		Write-Output "Url: $Url"
#		Write-Output "ListName: $ListName"
#		Write-Output "Document Type Count: " + $DocumentTypes.Count.ToString()
#		Write-Output "CommonScriptWorkingDirectory: $CommonScriptWorkingDirectory"
#		#END DEBUG
		
		Set-Location $CommonScriptWorkingDirectory
		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
		$Url = $Url
		$ListName = $ListName

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		foreach($office in $Offices)
		{
			$listItem = $listItems.Add()
			
		#	$listItems | Select InternalName | Format-Wide
			
			$changeRef = "RI0"  
			
		#	Get the CR item.
			$li = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			$changeRefLookupVal = $li.ID.ToString() + ";#" + $li.Title 
			
			$DocTypes = $office.DocumentType.split(";")

			$multientry = New-Object Microsoft.Sharepoint.SPFieldLookupValueCollection($null)

			foreach($doctype in $DocTypes)
			{
			try
			{
				$li = Get-ListItemByKeyVal -Url $Url -ListName "Document Type"  -Key "Title" -Val "$doctype"
				$documentTypesValue =  $li.ID.ToString() + ";#" + $li.Title + "; "
				$lookupentry = New-Object Microsoft.Sharepoint.SPFieldLookupValue($documentTypesValue)
				$multientry.Add($lookupentry)
				}
				catch [System.Exception]
				{
					#Write-Output "Error: $doctype"
				}
				
				$li = $null
				$documentTypesValue = $null
				$lookupentry = $null
			}
			
			$listItem["Title"] = $office.OfficeName
			$listItem["DocumentType"] = $multientry
			$listItem["ChangeRecordRef"] = $changeRefLookupVal  #$changeRef

			$listItem.Update();
			
			$listItem = $null
			$multientry = $null
		}
	}
	end{
		$Offices = $null
		
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}
