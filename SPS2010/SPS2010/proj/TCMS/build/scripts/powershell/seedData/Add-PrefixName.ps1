Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-PrefixName()
{
	<#
		.Example
			Add-PrefixName -ListName "Prefix Names" -Url "http://ddvm9093-sps1" -PrefixNames (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\PrefixNames.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$PrefixNames,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
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
		foreach($prefixName in $PrefixNames)
		{
			
			$listItem = $listItems.Add()
			
			$changeRef = "RI0" #+ $rand.Next(100)
			
		#	Get the CR item.
			$li = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			
			$changeRefLookupVal = $li.ID.ToString() + ";#" + $li.Title 

			$listItem["ChangeRecordRef"] = $changeRefLookupVal
			$listItem["Title"] = $prefixName.PrefixName
			$listItem["Style"] = $prefixName.StyleName

			$listItem.Update();
		}
	}
	end{
		$PrefixNames = $null
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}