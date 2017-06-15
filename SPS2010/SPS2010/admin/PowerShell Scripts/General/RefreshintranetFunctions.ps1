function WaitForJobToFinish([string]$SolutionFileName)
{ 
  $JobName = "*solution-deployment*$SolutionFileName*"
  $job = Get-SPTimerJob | ?{ $_.Name -like $JobName }
  if ($job -eq $null) 
  {
    Write-Host 'Timer job not found' -foregroundcolor "Magenta"
  }
  else
  {
    $JobFullName = $job.Name
    Write-Host -NoNewLine "Waiting to finish job $JobFullName"
    
    while ((Get-SPTimerJob $JobFullName) -ne $null) 
    {
      Write-Host -NoNewLine .
      Start-Sleep -Seconds 2
    }
    Write-Host "Finished waiting for job.."
  }
}


function RemoveSolution([string]$SolutionFileName,$url)
{
              
    $Solution = Get-SPSolution | where-object {$_.Name -eq $SolutionFileName} # check to see if solution package has been installed
    if ($Solution -ne $null) 
    {
    Write-Host "Solution exists, lets check if its deployed...."
    # check to see if solution package is currently deployed
        if($Solution.Deployed -eq $true)
        {
            Write-Host "Solution deployed, lets retract.."
            UnInstall-SPSolution -Identity $SolutionFileName -Confirm:$false -WebApplication $Url
            
            Write-Host "Solution retracted, lets remove..."
            
            Write-Host 'Waiting for job to finish'
            WaitForJobToFinish $SolutionFileName
        }
        Remove-SPSolution -Identity $SolutionFileName -Confirm:$false -Force 
        Write-Host "Solution removed, lets add solution back to the farm" -foregroundcolor "Green"
    }

}

function Ask-YesOrNo
	{
	param([string]$title)
	
	$choiceYes = New-Object System.Management.Automation.Host.ChoiceDescription "&Yes", "Answer Yes."
	$choiceNo = New-Object System.Management.Automation.Host.ChoiceDescription "&No", "Answer No."
	$options = [System.Management.Automation.Host.ChoiceDescription[]]($choiceYes, $choiceNo)
	$result = $host.ui.PromptForChoice($title, $message, $options, 1)
		switch ($result)
    	{
			0 
			{
			Return $true
			}
 
			1 
			{
			Return $false
			}
		}
	}




