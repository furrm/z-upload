[string]$smtpServer = "smtpinternal.omnia.aoglobal.uat"
#[string]$smtpServer = "localhost"
[string]$from = "sscdashboardsdonotreply@aoglobal.uat"
[string]$url = "http://gsp.intranet.allenovery.com/sites/ssc" # Url of the surveys
#[string]$url = "http://ddvm0277-unity1:82/"
[string]$sqlConnectionString = "Data Source=LNSISQL21U\INSTANCE1;Initial Catalog=AO_SSC_Data;Integrated Security=True"
#[string]$sqlConnectionString = "Data Source=.;Initial Catalog=AO_SSC_Data;Integrated Security=True"
$fileName =  [string]::Format("c:\temp\SSCDashboardsLog_{0:yyyyMMddHHmm}.log", (Get-Date))
$logName = "Application"
$logSource = "SSC Dashboard Scheduled Scripts"

$dashboardIds = @{
	"SSC" = 1;
	"OPS" = 2;
	"FIN" = 3;
}