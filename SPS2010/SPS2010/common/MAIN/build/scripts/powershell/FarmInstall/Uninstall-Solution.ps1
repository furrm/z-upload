function Uninstall-Solution()
{
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[ValidateNotNullOrEmpty()]
		[string]$SolutionName
		,
		[Parameter(Position=1)]
		[array]$Url
	)
	
	Write-Host "Uninstall-Solution function called."
	
#	Get the solution
#	$SolutionName = "ao.sps2010.tcms.webparts.wsp"
	$solution = Get-SPSolution -Identity $SolutionName -ErrorAction:SilentlyContinue
	
	if($solution -ne $null) #Solution exists?
	{
		if($solution.Deployed) #Solution deployed?
		{
			if(!$solution.ContainsWebApplicationResource)
			{
				Uninstall-SPSolution -Identity $SolutionName -Confirm:$false
				Check-Retraction $solution.Name
			}
			else
			{
				Write-Host "`tThe solution contains Web application scoped resources"
				
				if($Url.Length -gt 0) #Web application URL's have been specified
				{
					foreach($UrlToRetract in $Url)
					{
						if($UrlToRetract.ToLower() -eq "all")
						{
							Write-Host "Retracting solution from all web applications"
							Uninstall-SPSolution -Identity $SolutionName -AllWebApplications -Confirm:$false
							Check-Retraction $SolutionName
						}
						else
						{
							Write-Host "Retracting solution from $UrlToRetract"
							Uninstall-SPSolution -Identity $SolutionName -WebApplication $UrlToRetract -Confirm:$false
							Check-Retraction $solution.Name
						}
					}
				}
				
			}
		}
		else #Solution already retracted.
		{
			Write-Host "`tSolution $SolutionName has already been retracted."
			Write-Host "`tSkipping solution retraction."
		}
	}
	else #Solution not added.
	{
		Write-Host "Solution $SolutionName does not exist."
		Write-Host "`tSkipping solution retraction."
	}
	
	Write-Host "Uninstall-Solution function complete."
	$solution = $null
}

function Check-Retraction([string]$solutionName)
{
	$maxSecondsToRetract = 350
	$runningTime = 0
	
	
	do
	{
		Start-Sleep -s 1
		$runningTime++
		
		
		Write-Host "`tRunning Time: $runningTime seconds"
		$solution = Get-SPSolution -Identity $SolutionName -ErrorAction:SilentlyContinue
#		Write-Output "$Solution Deployed: $solution.Deployed"
#		Write-Host "`tJob Status: " $solution.JobStatus
		Write-Host "`tSolution last operation result: " $solution.LastOperationResult
		
		if($solution.JobExists -eq $false -and $solution.LastOperationResult -eq "RetractionSucceeded")
		{
			Write-Output "`tSolution $SolutionName retracted"
			break
		}
		
#		if($solution.Deployed)
#		{ 
			#Solution maybe marked as not deployed but the retraction job may still be running.
			
#			if($solution.JobExists)
#			{
				

#				if($solution.LastOperationResult -eq "RetractionSucceeded")
#				{
#				Write-Host "`tSolution last operation result: " $solution.LastOperationResult	
#				Write-Host "`tSolution $SolutionName retracted"
#				Write-Host "`tTotal running time: $runningTime seconds"
#				#break 
#				}
#			}
#		}
#		else
#		{
#			Write-Host "`tRetracting $SolutionName"
#			Write-Host "`tRunning Time: $runningTime seconds"
			
#			if($solution.JobExists)
#			{
#				Write-Host "`tJob Status: " $solution.JobStatus
#			}
			
#			if($solution.LastOperationResult -like "*SPSolution*")
#			{
#				Write-Host "`tSolution last operation result TEST: $solution.LastOperationResult"
#			}
#		}
		
	}
	while($runningTime -ne $maxSecondsToRetract)

	
}