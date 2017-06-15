#param(
#	[Parameter(Mandatory=$true, Position=0)]
#	[ValidateNotNullOrEmpty()]
#	[string]$ScriptWorkingDirectory
#	,
#	[Parameter(Mandatory=$true, Position=1)]
#	[ValidateNotNullOrEmpty()]
#	[string]$SolutionFilesDirectory
#	,
#	[Parameter(Mandatory=$true, Position=2)]
#	[ValidateNotNullOrEmpty()]
#	[string]$SolutionManifestFileName
#
#)
#$erroractionpreference = stop

#echo teamcity[buildStatus status='FAILURE' text='BANG!']
#Write-Error "BANG BANG!!!"
#Write-Host "ERROR: BANG!" -fore RED;
#$Host.SetShouldExit(123)
#exit
  




function Deploy-TCMS
{
	<#
		.SYNOPSIS
			Deploys SharePoint solutions to a Farm
		.DESCRIPTION
			This function will deploy SharePoint solutions from a SharePoint Farm.
			Requires the WSP files together with the solution manifest XML file to exist in the same directory.
			This funtion will also activate features where specified in the solution manifest.
			For more information about the use of the solution manifest file, please refer to the documentation and example files that can be found...
			TODO://Where will the documentation and example files be kept??
			TODO://Add Examples
	#>
	param(
	[Parameter(Mandatory=$true, Position=0)]
	[ValidateNotNullOrEmpty()]
	[xml]$SolutionManifest
	)
	begin{
	Write-Host "***** Deploy-TCMS function called *****"
	}
	
	process{
	
#		Write-Host "Importing Modules"
#
#		#Set the location for the script to run from the working directory.
#		#This allows modules to be imported using relative paths.
#		Set-Location -LiteralPath $ScriptWorkingDirectory
#
#		#Import the modules
#
#		#Solutions
#		Import-Module ".\Add-Solution.ps1"
#		Import-Module ".\Install-Solution.ps1"
#
#		#Feature
#		Import-Module ".\..\Features\Activate-Feature.ps1" -ErrorAction:Stop

#		$userName = [Environment]::UserName
#		$SolutionManifestFullFilePath = "$SolutionFilesDirectory\$SolutionManifestFileName"
#		[xml]$SolutionManifest = Get-Content $SolutionManifestFullFilePath
#		
#		Write-Host "`tScript running under username $userName"
#		Write-Host "`tSolution files directory set to $SolutionFilesDirectory"
#		Write-Host "`tSolution manifest file fullpath is $SolutionManifestFullFilePath"
#		Write-Host "`tWorking Directory set as $ScriptWorkingDirectory"
#		
#		Write-Host "`tLoading solution manifest file from $SolutionFilesDirectory."
		
		if($SolutionManifest -ne $null) #We have a solution manifest file.
		{
			
			#Step1: Solution Deployment
			if($SolutionManifest.SolutionDeployment.Solutions.ChildNodes.Count -gt 0) # We have some solutions to deploy.
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
					
					Write-Host "`tCalling Add-Solution for" $solution.Name
					Add-Solution -SolutionPath $SolutionFilesDirectory -SolutionName $solution.Name
					Write-Host "`tCalling Install-Solution for" $solution.Name
					Install-Solution -SolutionName $solution.Name -Url $deployArray
				}
				
			}
			else
			{
				Write-Host "`tError: Although a solution manifest file has been succesfully loaded, there are no solutions to process."
			}
			
			
			#Step 2: Feature Activation
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
		Write-Host "***** Deploy-TCMS function complete *****"
	}
}

#Deploy-TCMS
