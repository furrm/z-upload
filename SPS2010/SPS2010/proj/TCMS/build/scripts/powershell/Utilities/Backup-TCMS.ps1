function Backup-TCMS()
{
	<#
		.SYNOPSIS
			Creates a backup of the TCMS site and saves to a given location.
		.DESCRIPTION
			This function will backup a TCMS site that resides at the URL 
			http://tcms.intranet.allenovery.com.  The URL can be overridden if an 
			alternate URL is provided via the URL switch.
		.EXAMPLE
			Backup-TCMS -FullPath \\lnsifls01d\Transfer\furrm\TCMSSiteBackup\tcmsRelease.bak
		.EXAMPLE
			Backup-TCMS -Url http://ddvm9093-sps1 -FullPath S:\SiteCollectionBackups\tcmsLocal.bak
	#>
	param(
	[Parameter(Mandatory=$false, Position=0)]
	[String]$Url,
	[Parameter(Mandatory=$true, Position=1)]
	[ValidateNotNullOrEmpty()]
	[string]$FullPath
	)
	begin
	{
		$UrlToBackup = [System.String]::Empty
		
		if([System.String]::IsNullOrEmpty($Url))
		{
			$UrlToBackup = "http://tcms.intranet.allenovery.com"
		}
		else
		{
			$UrlToBackup = $Url
		}
		
		Write-Output "**** Performing site backup of $UrlToBackup to $FullPath ****"
	}
	process
	{
		Backup-SPSite -Identity $UrlToBackup -Path $FullPath -Verbose
	}
	end
	{
		Write-Output "**** Backup of $UrlToBackup is now complete ****"
	}
}