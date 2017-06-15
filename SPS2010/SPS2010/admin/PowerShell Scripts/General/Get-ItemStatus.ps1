#Load SnapIn
$snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
if ($snapin -eq $null) {
	Add-PSSnapin "Microsoft.SharePoint.Powershell"
}

$url = "http://global.intranet.allenovery.com"

Set-Content -Path C:\temp\ItemStatus.csv -Value "Title,ContentType,Status,WebUrl,ItemUrl"

$Site = Get-SPSite $url

$Webs = $Site.AllWebs


foreach ($web in $Webs) {

	$Lists = $web.Lists

	foreach ($List in $Lists) {

		$Items = $List.Items

		foreach ($Item in $Items) {

			Add-Content -Path C:\temp\ItemStatus.csv -Value "`"$($Item.Title)`",`"$($Item.ContentType.Name)`",`"$($Item.Level)`",`"$($web.url)`",`"$($Item.Url)`""

		}


	}





}

