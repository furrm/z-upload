#
# Start Parameters
#
    $MySiteUrl = "http://my.intranet.allenovery.com"
    $fileName =  [string]::Format("D:\WhosWho\Log\WhosWhosLog_{0:yyyyMMddHHmm}.log", (Get-Date))
    $siteUrl = "http://global.intranet.allenovery.com"                         # Site Collection
    $psconstr = "Data Source=LNSISQL22D\INSTANCE1;Initial Catalog=HRDDEV;User ID=PS_Service;Password=PS_Service" #People Soft DB Connection String
    $syncdb = "Data Source=WhosWhoSyncDB;Initial Catalog=WhosWho;User ID=WhosWhoSyncUser;Password=WhosWhoSyncUser;Max Pool Size=10;Min Pool Size=1"
    $syncdb2 = "Data Source=WhosWhoSyncDB;Initial Catalog=WhosWho;User ID=WhosWhoSyncUser;Password=WhosWhoSyncUser;Connection Timeout=60"
    $aodomain = "OMNIAD"
    $logName = "Application"
    $logSource = "PeopleSoft to UPS"
    $WhoWhoPhotoRoot = "\\lnviweb07d\photos\"
    $SQLShare = "\\lnvmiweb73d\c$\Temp\Images"
#
# End Parameters
#