Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-DocumentTypes()
{
	<#
		.Example
			Add-DocumentTypes -ListName "DocumentType" -Url "http://ddvm9093-sps1" -DocumentTypes (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\DocumentTypes.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$DocumentTypes,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
		#START DEBUG
		Write-Output "Url: $Url"
		Write-Output "ListName: $ListName"
		Write-Output "Document Type Count: " + $DocumentTypes.Count.ToString()
		Write-Output "CommonScriptWorkingDirectory: $CommonScriptWorkingDirectory"
		#END DEBUG
		
		Set-Location $CommonScriptWorkingDirectory
		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
		#Get a random Request ID number.
		$rand = New-Object  System.Random(1)
		$Url = $Url
		$ListName = $ListName

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		foreach($doctype in $DocumentTypes)
		{
			
			$listItem = $listItems.Add()
			
		#	$listItems | Select InternalName | Format-Wide
			
			$changeRef = "RI0"  #+ $rand.Next(100)
			
		#	Get the CR item.
			$li = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			
			$changeRefLookupVal = $li.ID.ToString() + ";#" + $li.Title 
			
			$listItem["Title"] = $doctype.DocumentType
			$listItem["LegacyDocumentID"] = $doctype.DocumentTypeID
			$listItem["CoreTemplate"] = $doctype.CoreTemplate
			$listItem["ChangeRecordRef"] = $changeRefLookupVal  #$changeRef

			$listItem.Update();
		}
	}
	end{
		$DocumentTypes -eq $null
		
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}
