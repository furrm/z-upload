function Update-TCMS
{
<#
		.SYNOPSIS
			Updates SharePoint solutions to a Farm.
	#>

	param(
	[Parameter(Mandatory=$true, Position=0)]
	[ValidateNotNullOrEmpty()]
	[xml]$SolutionManifest
	)
	begin{
	Write-Host "***** Update-TCMS function called *****"
	}
	process{
		if($SolutionManifest -ne $null) #We have a solution manifest file.
		{
			#Step1: Solution Update
			if($SolutionManifest.SolutionDeployment.Solutions.ChildNodes.Count -gt 0) # We have some solutions to update.
			{
				Write-Host $SolutionManifest.SolutionDeployment.Solutions.ChildNodes.Count " solutions to process"
				
				foreach($solution in $SolutionManifest.SolutionDeployment.Solutions.Solution)
				{
					if($solution.WebApplications -ne $null) #Have web applications element...
					{
						foreach($solutionWebApplication in $solution.WebApplications.WebApplication)
						{
							if($solution.WebApplications.WebApplication -ne $null)
							{
		#						Write-Host "DEBUG: Have WebApplication"
								$deployArray = $solution.WebApplications.WebApplication
		#						Write-Host "DEBUG: WebApplication = $array"

							}
						
						}
						
					}
					else
					{
						Write-Host "The solution manifest is missing the required WebApplications element for " $solution.Name
					}
					
					Write-Host "`tCalling Update-Solution for" $solution.Name
					Update-Solution -SolutionPath $SolutionFilesDirectory -SolutionName $solution.Name -Url $deployArray

				}
				
			}
			else
			{
				Write-Host "`tError: Although a solution manifest file has been succesfully loaded, there are no solutions to process."
			}
			
			#Step 2: Feature Deativation
			if($SolutionManifest.SolutionDeployment.Features.ChildNodes.Count -gt 0) # We have some features to deactivate.
			{
				Write-Host $SolutionManifest.SolutionDeployment.Features.ChildNodes.Count " features to deactivate"
				
				foreach($feature in $SolutionManifest.SolutionDeployment.Features.Feature)
				{
					if($feature.WebApplications -ne $null)
					{
						foreach($featureWebApplication in $feature.WebApplications.WebApplication)
						{
							if($feature.WebApplications.WebApplication -ne $null)
							{
								Write-Host "`tCalling Deactivate-Feature for " $feature.Name " at URL " $feature.WebApplications.WebApplication
								Deactivate-Feature -FeatureName $feature.Name -Url $feature.WebApplications.WebApplication
							}
						}
					}
					else
					{
						Write-Host "The solution manifest is missing the required WebApplications element for " $feature.Name
					}

				}
			}
			else
			{
				Write-Host "There are no features to process"
			}
			
			#Step 3: Feature Activation
			if($SolutionManifest.SolutionDeployment.Features.ChildNodes.Count -gt 0) # We have some features to activate.
			{
				Write-Host $SolutionManifest.SolutionDeployment.Features.ChildNodes.Count " features to activate"
				
				foreach($feature in $SolutionManifest.SolutionDeployment.Features.Feature)
				{
					if($feature.WebApplications -ne $null)
					{
						foreach($featureWebApplication in $feature.WebApplications.WebApplication)
						{
							if($feature.WebApplications.WebApplication -ne $null)
							{
								Write-Host "`tCalling Activate-Feature for " $feature.Name " at URL " $feature.WebApplications.WebApplication
								Activate-Feature -FeatureName $feature.Name -Url $feature.WebApplications.WebApplication
							}
						}
					}
					else
					{
						Write-Host "The solution manifest is missing the required WebApplications element for " $feature.Name
					}

				}
			}
			else
			{
				Write-Host "There are no features to process"
			}
			
		}
		else #Solution manifest file undefined.
		{
			Write-Host "`tError: There has been a problem loading the SolutionManifest.xml file."
		}
	}
	end{
		Write-Host "***** Update-TCMS function complete *****"
	}
}