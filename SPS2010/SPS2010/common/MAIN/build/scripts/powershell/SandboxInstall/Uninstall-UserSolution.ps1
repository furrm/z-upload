function Uninstall-UserSolution
{
	Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url,
		[Parameter(Mandatory=$true)]
		[String]
		$PackageName
	)
	Process
	{
		Uninstall-SPUserSolution -Identity $PackageName -Site $Url -Confirm:$false -ErrorAction:SilentlyContinue
	}
}

#cls
#Uninstall-UserSolution

#cls
#Get-SPUserSolution -Site "http://tcms.sharepoint101.com"