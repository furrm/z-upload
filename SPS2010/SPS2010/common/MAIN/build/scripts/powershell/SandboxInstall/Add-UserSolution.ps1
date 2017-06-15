
function Add-UserSolution
{
	Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url,
		[Parameter(Mandatory=$true)]
		[String]
		$SolutionPath,
		[Parameter(Mandatory=$true)]
		[String]
		$PackageName
	)
	Process
	{
		Write-Host "$SolutionPath\$PackageName"
		Add-SPUserSolution -Site $Url -LiteralPath "$SolutionPath\$PackageName"
	}
}


