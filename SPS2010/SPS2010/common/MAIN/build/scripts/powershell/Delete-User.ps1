function Delete-User
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
		$site = Get-SPSite -Identity $Url
		$web = $site.OpenWeb()
		
			$Group = $web.SiteGroups[$GroupName]
			
			#Make sure the user exists.
			$userToAdd = $web.Site.RootWeb.EnsureUser($User)
			$Group.AddUser($userToAdd)
			Write-Host "The user has been added."
	}
}