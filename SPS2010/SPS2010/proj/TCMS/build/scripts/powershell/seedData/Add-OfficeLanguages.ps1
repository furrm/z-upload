Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-OfficeLanguages()
{
	<#
		.Example
			Add-OfficeLanguages -ListName "Office Language" -Url "http://ddvm9093-sps1" -OfficeLanguages (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\DocumentTypes.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$OfficeLanguages,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
		#START DEBUG
#		Write-Output "Url: $Url"
#		Write-Output "ListName: $ListName"
#		Write-Output "Document Type Count: " + $DocumentTypes.Count.ToString()
#		Write-Output "CommonScriptWorkingDirectory: $CommonScriptWorkingDirectory"
		#END DEBUG
		
		Set-Location $CommonScriptWorkingDirectory
		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
		$Url = $Url
		$ListName = $ListName

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		foreach($officelang in $OfficeLanguages)
		{
			
			$listItem = $listItems.Add()
			
		#	$listItems | Select InternalName | Format-Wide
			
			$changeRef = "RI0"  #+ $rand.Next(100)
			
		#	Get the CR item.
			$li = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			$changeRefLookupVal = $li.ID.ToString() + ";#" + $li.Title 
			
			#Get Office Lookup
			$officeitem = Get-ListItemByKeyVal -Url $Url -ListName "Office"  -Key "Title" -Val $officelang.OfficeName
			$OfficeNameLookupVal = $officeitem.ID.ToString() + ";#" + $officeitem.Title 
			
			#Get Language Lookup
			$languageListItem = Get-ListItemByKeyVal -Url $Url -ListName "Language"  -Key "Title" -Val $officelang.LanguageName
			$languageLookupVal = $languageListItem.ID.ToString() + ";#" +  $languageListItem.Title

			$listItem["Title"] = $officelang.DocumentType
			$listItem["OfficeNameLookup"] = $OfficeNameLookupVal
			$listItem["LanguageNameLookup"] = $languageLookupVal
			$listItem["DefaultLanguage"] = $officelang.DefaultLanguage
			$listItem["ChangeRecordRef"] = $changeRefLookupVal  #$changeRef

			$listItem.Update();
		}
	}
	end{
		$OfficeLanguages -eq $null
		
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}
