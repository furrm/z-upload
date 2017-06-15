function Remove-UserSolution
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
	Remove-SPUserSolution -Identity $PackageName -Site $Url -Confirm:$false -ErrorAction:SilentlyContinue
}

#cls
#Remove-UserSolution
#Restart-Service w3svc -Force

#cls
#Get-SPUserSolution -Site "http://tcms.sharepoint101.com"