Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-CorrespondenceHeaderBlocks()
{
	<#
		.Example
			Add-CorrespondenceHeaderBlocks -ListName "CorrespondenceHeaderBlocks" -Url "http://ddvm9093-sps1" -CorrespondenceHeaderBlocks (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\CorrespondenceHeaderBlocks.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
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
		$CorrespondenceHeaderBlocks,
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
		foreach($corrheaderblock in $CorrespondenceHeaderBlocks)
		{
			$listItem = $listItems.Add()
			
			$listItem["CorrespondenceHeaderBlock"] = $corrheaderblock.CorrespondenceHeaderBlock
			$listItem["Title"] = $corrheaderblock.Name

			$listItem.Update();
		}
	}
	end{
		$CorrespondenceHeaderBlocks = $null
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}