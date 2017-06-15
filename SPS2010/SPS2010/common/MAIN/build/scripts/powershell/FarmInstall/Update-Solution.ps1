function Update-Solution()
{
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[ValidateNotNullOrEmpty()]
		[string]$SolutionPath,
		[Parameter(Mandatory=$true, Position=1)]
		[ValidateNotNullOrEmpty()]
		[string]$SolutionName,
		[Parameter(Mandatory=$false, Position=1)]
		[array]$Url
	)
	begin{
		Write-Host "Update-Solution function called."
		
		$LiteralPath = "$SolutionPath\$SolutionName"
		
		Write-Host "`tSolution path is set to $SolutionPath"
		Write-Host "`tSolution name is set to $SolutionName"
		Write-Host "`tLiteral name is set to $LiteralPath"
	}
	process{
		#Confirm that the solution has already been added.
		$solution = Get-SPSolution -ErrorAction:SilentlyContinue | Where-Object {$_.Name -eq $SolutionName}
		
		if($solution -ne $null)#Solution exists to update the solution.
		{
			Write-Host "***** Solution exists and will therefore be updated *****"
			
			Write-Host "Start updating solution $SolutionName"
			if(!$solution.ContainsWebApplicationResource)
			{
#				Install-SPSolution -Identity $SolutionName -GACDeployment:$solution.ContainsGlobalAssembly -CASPolicies:$solution.ContainsCasPolicy -Confirm:$false
#				Check-Deployment $SolutionName
			}
			else #Contains web application resource.
			{
				Write-Host "`tThe solution contains Web application scoped resources"

				if($Url.Length -gt 0) #Web application URL's have been specified
				{
					foreach($UrlToDeploy in $Url)
					{
					
						if($UrlToDeploy.ToLower() -eq "all")
						{
							Write-Host "Updating solution to all web applications"
							Update-SPSolution -Identity $SolutionName -LiteralPath $LiteralPath -GACDeployment:$solution.ContainsGlobalAssembly -CASPolicies:$solution.ContainsCasPolicy -Confirm:$false
							Check-Update $SolutionName
						}
						else
						{
							Write-Host "Updating solution to $UrlToDeploy"
							Update-SPSolution -Identity $SolutionName -LiteralPath $LiteralPath -GACDeployment:$solution.ContainsGlobalAssembly -CASPolicies:$solution.ContainsCasPolicy -Confirm:$false
							Check-Update $SolutionName
						}
					}
				}
			}
			
		}
		else
		{
			Write-Host "***** Solution does not exist so cannot be updated *****"
			Write-Host "`tSolution $SolutionName does not exist."
			Write-Host "`tSkipping solution update for $SolutionName."
		}
	}
	end{
		Write-Host "Update-Solution function complete."
	}
}

function Check-Update([string]$solutionName)
{
	$maxSecondsToDeploy = 60
	$runningTime = 0
	
	do
	{
		Start-Sleep -s 1
		$runningTime++
		
		
		Write-Host "`tRunning Time: $runningTime seconds"
		$solution = Get-SPSolution -Identity $SolutionName -ErrorAction:SilentlyContinue
		Write-Host "`tJob Status: " $solution.JobStatus
		Write-Host "`tSolution last operation result: " $solution.LastOperationResult
		
		if($solution.JobExists -eq $false -and $solution.LastOperationResult -eq "DeploymentSucceeded")
		{
			Write-Output "`tSolution $SolutionName deployed"
			break
		}
		
#		if($solution.Deployed)
#		{ 
#			Write-Host "`t$SolutionName deployed"
#			Write-Host "`tTotal running time: $runningTime seconds"
#			Write-Host "`tSolution last operation result: $solution.LastOperationResult"
#			
#			break 
#		}
#		else
#		{
#			Write-Host "`tDeploying $SolutionName"
#			Write-Host "`tRunning Time: $runningTime seconds"
#			
#			if($solution.JobExists)
#			{
#				Write-Host "`tJob Status = $solution.JobStatus"
#			}
#			
#			Write-Host "`tSolution last operation result: $solution.LastOperationResult"
#			
#		}
		
	}
	while($runningTime -ne $maxSecondsToDeploy)
}