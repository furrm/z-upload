#SnapIn Check
If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{
	Write-Output "Adding Microsoft.SharePoint.PowerShell snapin..."
	Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell
	Write-Output "Microsoft.SharePoint.PowerShell snapin added..."
}

function Create-Group()
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

		#Get Site and Web objects
#		$site = Get-SPSite -Identity "http://ddvm9093-sps1"
#		$GroupName = "Doc Experts"
		
		$site = Get-SPSite -Identity $Url
		$web = $site.OpenWeb()

		
		#Write-Host $Groups
		
		if ($web.SiteGroups[$GroupName] -eq $null)
		{
			$Groups = $web.SiteGroups
			
			#$newGroup = $web.SiteGroups.Add("Docs Experts",  $web.Site.Owner, $web.Site.Owner, "Docs Experts")
			
			$Groups.Add($GroupName,  $web.Site.Owner, $web.Site.Owner, $GroupDescription)
			$web.Update()
			
			$newGroup = $web.SiteGroups[$GroupName]
			
			###### Create a new assignment (group and permission level pair) which will be added to the web object
			$newGroupAssignment = new-object Microsoft.SharePoint.SPRoleAssignment($newGroup)
			###### Get the permission levels to apply to the new groups
			$fullControlRoleDefinition = $web.Site.RootWeb.RoleDefinitions["Full Control"]
			###### Assign the groups the appropriate permission level
			$newGroupAssignment.RoleDefinitionBindings.Add($fullControlRoleDefinition)
			###### Add the groups with the permission level to the site
			$web.RoleAssignments.Add($newGroupAssignment)
			$web.Update()
			Write-Host "The $GroupName group has been created." 
			
		}
		else
		{Write-Host "The $GroupName group already exists." }
		
		#Dispose of Web and Site objects
		$web.Dispose()
	}


}
