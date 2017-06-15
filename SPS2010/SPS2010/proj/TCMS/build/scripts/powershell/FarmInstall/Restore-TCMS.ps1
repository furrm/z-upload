Add-PSSnapin -Name "Microsoft.SharePoint.Powershell" -ErrorAction:SilentlyContinue

Restore-SPSite -Identity "http://ddvm9093-sps1" -Path "S:\SiteCollectionBackups\tcmsRelease.bak" -Force:$true

Get-SPContentDatabase -Site "http://ddvm9093-sps1"

#[-DatabaseServer <Database server name>] [-DatabaseName <Content database name>] [-HostHeader <Host header>] [-Force] [-GradualDelete] [-Verbose]

Update-SPSolution 