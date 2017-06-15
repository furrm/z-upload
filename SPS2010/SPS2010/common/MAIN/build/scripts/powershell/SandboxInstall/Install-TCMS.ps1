
Set-Location -LiteralPath "S:\ao_dev\SPS2010-MASTER-FURRM\shared\MAIN\build\scripts\powershell\SandboxInstall"
$scriptLocation = Get-Location
#cls
#Write-Output $scriptLocation
cls
	Import-Module ("S:\ao_dev\SPS2010-MASTER-FURRM\common\MAIN\build\scripts\powershell\Delete-Lists.ps1")
	Import-Module ("S:\ao_dev\SPS2010-MASTER-FURRM\common\MAIN\build\scripts\powershell\SandboxInstall\Add-UserSolution.ps1")
	Import-Module ("S:\ao_dev\SPS2010-MASTER-FURRM\common\MAIN\build\scripts\powershell\SandboxInstall\Install-UserSolution.ps1")
	Import-Module ("S:\ao_dev\SPS2010-MASTER-FURRM\common\MAIN\build\scripts\powershell\SandboxInstall\Uninstall-UserSolution.ps1")
	Import-Module ("S:\ao_dev\SPS2010-MASTER-FURRM\common\MAIN\build\scripts\powershell\SandboxInstall\Remove-UserSolution.ps1")
	

function Install-TCMS
{
	Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url,
		[Parameter(Mandatory=$true)]
		[String]
		$SolutionPath,
		[Parameter(Mandatory=$true)]
		[String]
		$PackageName
	)
	Process
	{
#		$solution = Get-SPUserSolution -Site "http://tcms.intranet.allenovery.com"
		
		
		
		Add-UserSolution -Url $url -PackageName $PackageName -SolutionPath $SolutionPath
		Start-Sleep -Seconds 2
		Install-UserSolution -Url $url -PackageName $PackageName
		Start-Sleep -Seconds 2
		Write-Host "$PackageName Installed!!!"
		
		
	}
}

function Uninstall-TCMS
{
Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url,
		[Parameter(Mandatory=$true)]
		[String]
		$PackageName
	)
	Process
	{
#		$solution = Get-SPUserSolution -Site "http://tcms.intranet.allenovery.com"
		
		
		Uninstall-UserSolution -Url $url -PackageName $PackageName
		Start-Sleep -Seconds 2
		Remove-UserSolution -Url $url -PackageName $PackageName
		Start-Sleep -Seconds 2
		
		Write-Host "$PackageName Uninstalled!!!"
		
		
	}
}

$url = "http://tcms.intranet.allenovery.com"


$listsPackageName = "AO.SPS2010.TCMS.Lists.wsp"
$siteColumnsPackageName = "AO.SPS2010.TCMS.SiteColumns.wsp"
$contentTypePackageName = "AO.SPS2010.TCMS.ContentTypes.wsp"


$listsColumnsSolutionPath = "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\src\AO.SPS2010.TCMS.Lists\bin\Debug"
$siteColumnsSolutionPath = "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\src\AO.SPS2010.TCMS.SiteColumns\bin\Debug"
$contentTypesSolutionPath = "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\src\AO.SPS2010.TCMS.ContentTypes\bin\Debug"

#Delete the list instances
Delete-List -Url $Url -ListName "Change Record"
Delete-List -Url $Url -ListName "Language"
Delete-List -Url $Url -ListName "TCMS - Templates"
Delete-List -Url $url -ListName "Shared Documents"
		
#Uninstall in reverse order...
Uninstall-TCMS -Url $url -PackageName $contentTypePackageName
Uninstall-TCMS -Url $url -PackageName $siteColumnsPackageName
Uninstall-TCMS -Url $url -PackageName $listsPackageName

#Install lists, then site columns, then content types...
Install-TCMS -Url $url -PackageName $listsPackageName -SolutionPath $listsColumnsSolutionPath
Install-TCMS -Url $url -PackageName $siteColumnsPackageName -SolutionPath $siteColumnsSolutionPath
Install-TCMS -Url $url -PackageName $contentTypePackageName -SolutionPath $contentTypesSolutionPath


