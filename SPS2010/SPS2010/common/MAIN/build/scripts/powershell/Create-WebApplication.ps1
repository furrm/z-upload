
#SnapIn Check
If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{
	Write-Output "Adding Microsoft.SharePoint.PowerShell snapin..."
	Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell
	Write-Output "Microsoft.SharePoint.PowerShell snapin added..."
	
}

function Create-WebApplication
{
	Param(
#		[Parameter(Mandatory=$true)]
#		[String]
#		$SiteName,
		[Parameter(Mandatory=$true)]
		[string]
		$Url,
		[Parameter(Mandatory=$true)]
		[int]
		$Port,
		[Parameter(Mandatory=$true)]
		[string]
		$ManagedAccount,
		[Parameter(Mandatory=$true)]
		[string]
		$ContentDatabaseServer

	)
	Process
	{
#		cls
#		$Url = "http://tcms.intranet.allenovery.com"
		
		[System.Uri]$uri = $url
		$firstDNSSegment = $uri.DnsSafeHost.Split(".")[0]
#		Write-Host $array
#		IIS Web Site Variables
		$WebApplicationName = $uri.DnsSafeHost + " - " + $Port #tcms.intranet.allenovery.com - 80
		$WebApplicationHostHeader = $uri.DnsSafeHost
		
#		#Appication Pool Variables
		$ApplicationPoolName = $firstDNSSegment + " - " + $Port
		$ApplicationPoolAccount = (Get-SPManagedAccount $ManagedAccount) #This needs to be a SharePoint Managed Account.
				
		#Content Database Variables
		$ContentDatabaseName = "$firstDNSSegment" + "_Content"
		
		#IIS Web Site Variables
#		$WebApplicationName = "$SiteName" + "." + "$Domain" + " - " + $Port #tcms.intranet.allenovery.com - 80
#		$WebApplicationHostHeader = "$SiteName" + "." + "$Domain" #tcms.intranet.allenovery.com
#		$Url = ("http://" + "$SiteName" + "." + "$Domain")
		
		#Appication Pool Variables
#		$ApplicationPoolName = "TcmsAppPool - $WebApplicationPort"
#		$ApplicationPoolAccount = (Get-SPManagedAccount "OMNIAD\zadmfurr") #This needs to be a SharePoint Managed Account.
		
		#Content Database Variables
#		$ContentDatabaseName = "$SiteName" + "_Content"
		
		Write-Host "Creating web application..."
		
		New-SPWebApplication  -Name $WebApplicationName -Port $Port -HostHeader $WebApplicationHostHeader -Url $Url -ApplicationPool $ApplicationPoolName -ApplicationPoolAccount $ApplicationPoolAccount -DatabaseServer $ContentDatabaseServer -DatabaseName $ContentDatabaseName  -Verbose -OutVariable $Output
		
		Write-Host $Output
	}
	
}