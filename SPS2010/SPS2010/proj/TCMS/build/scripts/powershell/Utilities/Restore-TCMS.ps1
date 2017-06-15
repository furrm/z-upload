function Restore-TCMS
{
	<#
		.SYNOPSIS
			Restores a backup of the TCMS site from a given file location.
		.DESCRIPTION
			This function will restore a TCMS site to a given URL.
			
			The site will be restored to http://tcms.intranet.allenovery.com, but an  
			alternate URL to restore to can be provided via the optional URL switch.
		.EXAMPLE
			Restore-TCMS -FullPath \\lnsifls01d\Transfer\furrm\TCMSSiteBackup\tcmsRelease.bak -ContentDatabaseName WSS_Content_2f08661f746a48e0a603f4b6e55de5bf -DatabaseServer ddvm9093-sql1\sharepoint2010
		.EXAMPLE
			Restore-TCMS -Url http://ddvm9093-sps1 -FullPath \\lnsifls01d\Transfer\furrm\TCMSSiteBackup\tcmsRelease3.bak -ContentDatabaseName WSS_Content_2f08661f746a48e0a603f4b6e55de5bf -DatabaseServer ddvm9093-sql1\sharepoint2010
	#>
	param(
	[Parameter(Mandatory=$false, Position=0)]
	[String]$Url,
	[Parameter(Mandatory=$true, Position=1)]
	[ValidateNotNullOrEmpty()]
	[string]$FullPath,
	[Parameter(Mandatory=$true, Position=1)]
	[ValidateNotNullOrEmpty()]
	[string]$ContentDatabaseName,
	[Parameter(Mandatory=$true, Position=1)]
	[ValidateNotNullOrEmpty()]
	[string]$DatabaseServer
	)
	begin
	{
		$UrlToRestore = [System.String]::Empty
		
		if([System.String]::IsNullOrEmpty($Url))
		{
			$UrlToRestore = "http://tcms.intranet.allenovery.com"
		}
		else
		{
			$UrlToRestore = $Url
		}
		
		Write-Output "**** Performing site restore to $UrlToRestore from $FullPath ****"
	}
	process
	{
		Restore-SPSite -Identity $UrlToRestore -Path $FullPath -DatabaseName $ContentDatabaseName -DatabaseServer $DatabaseServer -Force -Verbose
	}
	end
	{
		Write-Output "**** Restore to $UrlToRestore is now complete ****"
	}
}