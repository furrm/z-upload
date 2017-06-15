Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-OfficeElements()
{
	<#
		.Example
			Add-OfficeElements -ListName "OfficeElements" -Url "http://ddvm9093-sps1" -OfficeElements (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\OfficeElements.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$OfficeElements,
		[Parameter(Mandatory=$true, Position=3)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
		Set-Location $CommonScriptWorkingDirectory
		#Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
		$Url = $Url
		$ListName = $ListName

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		foreach($officeElement in $OfficeElements)
		{
			$listItem = $listItems.Add()

			$listItem["Title"] = $officeElement.OfficeElement
			$listItem.Update();
		}
	}
	end{
		$OfficeElements = $null
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}