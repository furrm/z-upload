
$SiteCollections = Get-SPSite

foreach($Site in $SiteCollections) {

	$filename = $Site.Url.SubString(7).Replace("/","_")

	$BackupPath = "C:\Backup\$($filename).bak"

	Backup-SPSite $Site.Url -Path $BackupPath -Force
	


}

