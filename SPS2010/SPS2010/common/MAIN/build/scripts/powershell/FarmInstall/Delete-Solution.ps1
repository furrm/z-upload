function Delete-Solution()
{
	param(
#		[Parameter(Mandatory=$true, Position=0)]
#		[ValidateNotNullOrEmpty()]
#		[string]$SolutionPath,
		[Parameter(Mandatory=$true, Position=1)]
		[ValidateNotNullOrEmpty()]
		[string]$SolutionName
	)
	
#	$SolutionName = "ao.sps2010.tcms.webparts.wsp"
	
	Write-Host "Delete-Solution function called."
	
#	$LiteralPath = "$SolutionPath\$SolutionName"
	
#	Write-Host "`tSolution path is set to $SolutionPath"
#	Write-Host "`tSolution name is set to $SolutionName"
#	Write-Host "`tLiteral name is set to $LiteralPath"
	
	#Check to see whether the solution has already been deleted.
	$solution = Get-SPSolution -ErrorAction:SilentlyContinue | Where-Object {$_.Name -eq $SolutionName} -ErrorAction:SilentlyContinue
	
	if($solution -ne $null)#Solution exists so remove it.
	{
		if($solution.Deployed) #Check that the solution is not deployed.
		{
			Write-Host = "`tSolution $SolutionName is in a deployed state so unable to remove."
			Write-Host "`tSkipping solution delete for $SolutionName."
		}
		else
		{
			Write-Host "`tDeleting solution $SolutionName."
			Remove-SPSolution -Identity $SolutionName -Confirm:$false
			Write-Host "`tSolution deleted."
		}
	}
	else #Solution has already been deleted.
	{
		Write-Host "`tSolution $SolutionName already deleted."
		Write-Host "`tSkipping solution delete for $SolutionName."
	}
	
	Write-Host "Delete-Solution function complete."
}
