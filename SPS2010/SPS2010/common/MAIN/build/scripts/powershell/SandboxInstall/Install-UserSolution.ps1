function Install-UserSolution
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
		Install-SPUserSolution -Identity $PackageName -Site $Url 
	}
}

#cls
#Install-UserSolution
#Restart-Service w3svc -Force

#cls
#Get-SPUserSolution -Site "http://tcms.sharepoint101.com"
