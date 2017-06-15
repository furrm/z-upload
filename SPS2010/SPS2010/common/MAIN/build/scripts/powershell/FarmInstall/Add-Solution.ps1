function Add-Solution()
{
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[ValidateNotNullOrEmpty()]
		[string]$SolutionPath,
		[Parameter(Mandatory=$true, Position=1)]
		[ValidateNotNullOrEmpty()]
		[string]$SolutionName
	)
	
#	$SolutionName = "ao.sps2010.tcms.webparts.wsp"
	
	Write-Host "Add-Solution function called."
	
	$LiteralPath = "$SolutionPath\$SolutionName"
	
	Write-Host "`tSolution path is set to $SolutionPath"
	Write-Host "`tSolution name is set to $SolutionName"
	Write-Host "`tLiteral name is set to $LiteralPath"
	
	#Check to see whether the solution has already been added.
	$solution = Get-SPSolution -ErrorAction:SilentlyContinue | Where-Object {$_.Name -eq $SolutionName}
	
	if($solution -eq $null)#Solution does not exist so add it.
	{
		Write-Host "`tAdding solution."
		Add-SPSolution -LiteralPath $LiteralPath -Confirm:$false
		Write-Host "`tSolution added."
	}
	else #Solution has already been added.
	{
		Write-Host "`tSolution $SolutionName already exists."
		Write-Host "`tSkipping solution add for $SolutionName."
	}
	
	Write-Host "Add-Solution function complete."
}
