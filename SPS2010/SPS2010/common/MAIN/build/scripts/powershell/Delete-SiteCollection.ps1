#SnapIn Check
If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{
	Write-Output "Adding Microsoft.SharePoint.PowerShell snapin..."
	Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell
	Write-Output "Microsoft.SharePoint.PowerShell snapin added..."
}

function Delete-SiteCollection
{
	Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url
	)
	Process
	{
		$Output = ""
	
		#Delete the Sharepoint site collection.
		Remove-SPSite -Identity $Url -GradualDelete
	
		Write-Output $Output
	}
}