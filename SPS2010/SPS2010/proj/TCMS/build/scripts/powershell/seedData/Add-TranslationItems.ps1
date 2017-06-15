Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-TranslationItems()
{
	<#
		.Example
			Add-TranslationItems -ListName "Translation Items" -Url "http://ddvm9093-sps1" -TranslationItems (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\TranslationItems.csv")  -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$TranslationItems,
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
		foreach($translationItem in $TranslationItems)
		{

			
			
			$listItem = $listItems.Add()
			
			$changeRef = "RI0" #+ $rand.Next(100)
			
			#Get the CR item.
			$changeRecordReferenceListItem = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			
			#Get the Translation Name List Item
			$translationNameListItem = Get-ListItemByKeyVal -Url $Url -ListName "Translations" -Key "Title" -Val $translationItem.TranslationName
			
			#Get the language name
			$languageListItem = Get-ListItemByKeyVal -Url $Url -ListName "Language"  -Key "Title" -Val $translationItem.LanguageName
			
			
			$changeRefLookupVal = $changeRecordReferenceListItem.ID.ToString() + ";#" + $changeRecordReferenceListItem.Title 
			$translationNameLookupVal = $translationNameListItem.ID.ToString() + ";#" + $translationNameListItem.Title
			$languageLookupVal = $languageListItem.ID.ToString() + ";#" +  $languageListItem.Title

			$listItem["ChangeRecordRef"] = $changeRefLookupVal
			$listItem["ElementValue"] = $translationItem.Translation
			$listItem["TranslationName"] = $translationNameLookupVal
			$listItem["LanguageNameLookup"] = $languageLookupVal	

			$listItem.Update();
			

		}
	}
	end{
		$TranslationItems = $null
		
		$listItem = $null
		$listItems = $null
		$list= $null
		$web.Dispose()
		$web = $null
	}
}