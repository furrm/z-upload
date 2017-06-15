# Load SharePoint Snapin
Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
$snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
if ($snapin -eq $null) {
	Add-PSSnapin "Microsoft.SharePoint.Powershell"
}
Write-Host -ForeGroundColor Green " (done)"

$web = Get-SPWeb "http://ddvm0277-unity1:82"
$lists = $web.Lists | Where-Object { $_.BaseType -eq 4 }

$lists | ForEach-Object -Process { 
        
        Write-Host $_.Title
        #$fields = $_.Fields | Where-Object { $_.CanBeDeleted -eq $true }
        #$fields | ForEach-Object -Process { 

		#	$changed = $false

		#	if ($_.Type -eq "Note" -and $_.RichText -eq $true)
		#	{
		#		Write-Host "   Changing Note Field $($_.DisplayName) to Plain Text"	
		#		$_.RichText = $false
		#		$changed = $true
		#	}
		#
		#	if ($_.Required -eq $true)
		#	{
		#		Write-Host "   Changing Manatory Field $($_.DisplayName)"
		#		$_.Required = $false
		#		$changed = $true
		#	}
		#
		#	if ($changed) {
		#		$_.Update()
		#	}
		#}

		[System.Collections.Hashtable]$ht = $_.RootFolder.Properties
        if ($ht.ContainsKey("SSCDashboardType"))
        {
            $v = $ht["SSCDashboardType"]
			if ($v -eq "SSC") {
				$ht["SSCDashboardType"] = "1"
			}

			if ($v -eq "OPS") {
				$ht["SSCDashboardType"] = "2"
			}

			if ($v -eq "FIN") {
				$ht["SSCDashboardType"] = "3"
			}

			$_.RootFolder.Update()
        }

}