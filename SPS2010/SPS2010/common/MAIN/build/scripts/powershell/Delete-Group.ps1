#SnapIn Check
If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{
	Write-Output "Adding Microsoft.SharePoint.PowerShell snapin..."
	Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell
	Write-Output "Microsoft.SharePoint.PowerShell snapin added..."
}

function Delete-Group
{
	Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url,
		[Parameter(Mandatory=$true)]
		[String]
		$GroupName,
		[Parameter(Mandatory=$true)]
		[String]
		$GroupDescription
	)
		Process
	{
		$web = Get-SPWeb($Url)
		
		$web = Get-SPWeb("http://ddvm9093-sps1")
		$GroupName = "Doc Experts"
		
		if ($web.Groups[$GroupName] -ne $null)
		{
#			$groupToDelete = $web.Groups[$GroupName]
			cls
			$web.Groups.Remove($GroupName)
			
			
			
		}
	}
}