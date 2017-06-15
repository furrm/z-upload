function Install-Solution()
{
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[ValidateNotNullOrEmpty()]
		[string]$SolutionName
		,
		[Parameter(Mandatory=$false, Position=1)]
		[array]$Url
	)
	
	Write-Host "Install-Solution function called."
	
#	$SolutionName = "ao.sps2010.tcms.webparts.wsp"
	$solution = Get-SPSolution -Identity $SolutionName -ErrorAction:SilentlyContinue
	
	if($solution -ne $null) #Solution exists?
	{
		if($solution.Deployed -eq $false) #Solution deployed?
		{
#			Deploy solution
			Write-Host "Start deploying solution $SolutionName."
			
			if(!$solution.ContainsWebApplicationResource)
			{
				Install-SPSolution -Identity $SolutionName -GACDeployment:$solution.ContainsGlobalAssembly -CASPolicies:$solution.ContainsCasPolicy -Confirm:$false
				Check-Deployment $SolutionName
			}
			else #Contains web application resource.
			{
				Write-Host "`tThe solution contains Web application scoped resources"
#				Write-Host "DEBUG: URL Length = " $Url.Length
				if($Url.Length -gt 0) #Web application URL's have been specified
				{
					foreach($UrlToDeploy in $Url)
					{
#						Write-Host "DEBUG: UrlToDeploy = " $UrlToDeploy
						if($UrlToDeploy.ToLower() -eq "all")
						{
							Write-Host "Deploying solution to all web applications"
							Install-SPSolution -Identity $SolutionName -AllWebApplications -GACDeployment:$solution.ContainsGlobalAssembly -CASPolicies:$solution.ContainsCasPolicy -Confirm:$false
							Check-Deployment $SolutionName
						}
						else
						{
							Write-Host "Deploying solution to $UrlToDeploy"
							Install-SPSolution -Identity $SolutionName -WebApplication $UrlToDeploy -GACDeployment:$solution.ContainsGlobalAssembly -CASPolicies:$solution.ContainsCasPolicy -Confirm:$false
							Check-Deployment $SolutionName
						}
					}
				}
			}
		}
		else #Solution already deployed.
		{
			Write-Host "Solution $SolutionName has already been deployed."
			Write-Host "`tSkipping solution deployment."
		}
	}
	else #Solution not added.
	{
		Write-Host "Solution $SolutionName does not exist."
		Write-Host "`tSkipping solution deployment."
	}
	
	Write-Host "Install-Solution function complete."
	$solution = $null
	
}

function Check-Deployment([string]$solutionName)
{
	$maxSecondsToDeploy = 350
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