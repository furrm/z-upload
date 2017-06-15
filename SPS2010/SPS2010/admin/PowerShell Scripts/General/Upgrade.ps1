[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Practices.ServiceLocation") | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Practices.SharePoint.Common") | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Practices.SharePoint.Common.Configuration.ConfigurationProxy") | Out-Null

$url = "http://thebridge.intranet.allenovery.com"
#$url = "http://ddvm0277-unity1"

$UnityVersionNumber = "1.1.0.0"
$UnityReleaseNumber = "1"

$serviceLocator = [Microsoft.Practices.SharePoint.Common.ServiceLocation.SharePointServiceLocator]::GetCurrent()
$configManager = $serviceLocator.GetInstance([Microsoft.Practices.SharePoint.Common.Configuration.IConfigManager])

$site = Get-SPSite $url

Write-Host "Updating Unity II Web Application - Site Collection Settings"

$bag = New-Object Microsoft.Practices.SharePoint.Common.Configuration.SPSitePropertyBag($site)

$configManager.SetInPropertyBag("UnityVersionNumber", $UnityVersionNumber, $bag)
$configManager.SetInPropertyBag("UnityRelease", $UnityReleaseNumber, $bag)

#$web = Get-SPWeb http://ddvm0277-Unity1/Admin
#$webBag = New-Object Microsoft.Practices.SharePoint.Common.Configuration.SPWebPropertyBag($web)
#$configManager.SetInPropertyBag("UnityAdminSite", $true, $webBag)

