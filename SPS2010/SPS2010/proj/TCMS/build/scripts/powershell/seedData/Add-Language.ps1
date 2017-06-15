Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-Language()
{
	<#
		.Example
			Add-Language -ListName "Language" -Url "http://ddvm9093-sps1" -Languages (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\Language.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$Languages,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
		#START DEBUG
		Write-Output "Url: $Url"
		Write-Output "ListName: $ListName"
		Write-Output "Language Count: " + $Languages.Count.ToString()
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
		foreach($language in $Languages)
		{
			
			$listItem = $listItems.Add()
			
		#	$listItems | Select InternalName | Format-Wide
			
			$changeRef = "RI0"  #+ $rand.Next(100)
			
		#	Get the CR item.
			$li = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			
			$changeRefLookupVal = $li.ID.ToString() + ";#" + $li.Title 
			
			$listItem["Title"] = $language.LanguageName
			$listItem["LanguageId"] = $language.LanguageCode
			$listItem["LocaleId"] = $language.LocaleID
			$listItem["DateFormat"] = $language.DateFormat
			$listItem["ChangeRecordRef"] = $changeRefLookupVal  #$changeRef

			$listItem.Update();
		}
	}
	end{
		$Languages -eq $null
		
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}
