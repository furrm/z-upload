function Itereate-VersionHistory()
{
#	$spSite = new-object Microsoft.SharePoint.SPSite("http://lnvmiapp115d")
#	$spWeb = $spSite.OpenWeb("StudioShorts")
	
	cls
	$web = Get-SPWeb "http://ddvm9093-sps1:11221"
    $list = $web.Lists["Tasks"]
	
	foreach($item in $list.Items)
	{
		Write-Output $item.GetType()
		
		if($item.Versions.Count -gt 1)
		{
			Write-Output "Have versions!"
			
			foreach($version in $item.Versions)
			{
				Write-Output $version.VersionLabel
				Write-Output $version.VersionId
				Write-Output $version["Change Id"].ToString()
				Write-Output $version["Title"].ToString()
				Write-Output $version["Priority"].ToString()
				Write-Output $version["Description"].ToString()
				Write-Output $version["Start Date"].ToString()
				Write-Output $version["Due Date"].ToString()

#				Write-Output $version.ListItem.GetType()
#				Write-Output $version.ListItem["Due Date"].ToString()
			}
		}
	}
	

	$web = $null
}

#function Write-Fields()
#{
#	begin{"Fields"}
#	process{
#}
cls
Itereate-VersionHistory
