Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-PicklistItems()
{
	<#
		.Example
			Add-PicklistItems -ListName "Picklist Items" -Url "http://ddvm9093-sps1" -PicklistItems (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\PicklistItems.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$PicklistItems,
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
		foreach($picklistItem in $PicklistItems)
		{
			$listItem = $listItems.Add()
			
			$changeRef = "RI0" #+ $rand.Next(100)
			
			#Get the CR item.
			$changeRecordReferenceListItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			
			#Get the Picklist Name List Item
			$picklistNameListItem = Get-ListItemByKeyVal -Url $Url -ListName "Picklist Names" -Key "Title" -Val $picklistItem.PicklistName
			
			#Get the language name
			$languageListItem = Get-ListItemByKeyVal -Url $Url -ListName "Language"  -Key "Title" -Val $picklistItem.LanguageName
			
			
			$changeRefLookupVal = $changeRecordReferenceListItem.ID.ToString() + ";#" + $changeRecordReferenceListItem.Title 
			$languageLookupVal = $languageListItem.ID.ToString() + ";#" +  $languageListItem.Title
			$picklistNameNameLookupVal = $picklistNameListItem.ID.ToString() + ";#" + $picklistNameListItem.Title


			$listItem["ChangeRecordRef"] = $changeRefLookupVal
			$listItem["ElementValue"] = $picklistItem.Translation
			$listItem["PicklistName"] = $picklistNameNameLookupVal
			$listItem["LanguageNameLookup"] = $languageLookupVal
		

			$listItem.Update();
			

		}
	}
	end{
		$PicklistItems = $null
		
		$listItem = $null
		$listItems = $null
		$list= $null
		$web.Dispose()
		$web = $null
	}
}