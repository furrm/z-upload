#SnapIn Check
If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{
	Write-Output "Adding Microsoft.SharePoint.PowerShell snapin..."
	Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell
	Write-Output "Microsoft.SharePoint.PowerShell snapin added..."
}

function Create-User()
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
		$User
	)
	Process
	{
		#Get Site and Web objects
		$site = Get-SPSite -Identity $Url
		$web = $site.OpenWeb()
		
		
		if ($web.SiteGroups[$GroupName] -eq $null)
		{
			Write-Host "You need to add the $GroupName group before you can add users." 
		}
		else
		{
			$Group = $web.SiteGroups[$GroupName]
			
			#Make sure the user exists.
			$userToAdd = $web.Site.RootWeb.EnsureUser($User)
			$Group.AddUser($userToAdd)
			Write-Host "The user has been added." 
		}
		
		#Dispose of Web and Site objects
		$web.Dispose()
		$site.Dispose()
	}


}
