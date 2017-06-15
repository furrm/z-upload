Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-PrefixItems()
{
	<#
		.Example
			Add-PrefixItems -ListName "Prefix Items" -Url "http://ddvm9093-sps1" -PrefixItems (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\PrefixItems.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$PrefixItems,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
	
		Set-Location $CommonScriptWorkingDirectory
		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
		#Get a random Request ID number.
		$rand = New-Object  System.Random(1)

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		foreach($prefixItem in $PrefixItems)
		{
			$listItem = $listItems.Add()
			
			$changeRef = "RI0" #+ $rand.Next(100)
			
			#Get the CR item.
			$changeRecordReferenceListItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			
			#Get the Picklist Name List Item
			$prefixNameListItem = Get-ListItemByKeyVal -Url $Url -ListName "Prefix Names" -Key "Title" -Val $prefixItem.PrefixName
			
			#Get the language name
			$languageListItem = Get-ListItemByKeyVal -Url $Url -ListName "Language"  -Key "Title" -Val $prefixItem.LanguageName
			
			
			$changeRefLookupVal = $changeRecordReferenceListItem.ID.ToString() + ";#" + $changeRecordReferenceListItem.Title 
			$languageLookupVal = $languageListItem.ID.ToString() + ";#" +  $languageListItem.Title
			$prefixNameNameLookupVal = $prefixNameListItem.ID.ToString() + ";#" + $prefixNameListItem.Title


			$listItem["ChangeRecordRef"] = $changeRefLookupVal
			$listItem["ElementValue"] = $prefixItem.Translation
			$listItem["PrefixName"] = $prefixNameNameLookupVal
			$listItem["LanguageNameLookup"] = $languageLookupVal
		

			$listItem.Update();
			

		}
	}
	end{
		$PrefixItems = $null
		
		$listItem = $null
		$listItems = $null
		$list= $null
		$web.Dispose()
		$web = $null
	}
}