

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




function Retract-TCMS()
{
	<#
		.SYNOPSIS
			Retracts solutions from a Farm
		.DESCRIPTION
			This function will retract SharePoint solutions from a SharePoint Farm.
			Requires the WSP files together with the solution manifest XML file to exist in the same directory.
			This funtion will also deactivate features and remove lists where specified in the solution manifest.
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
	Write-Host "***** Retract-TCMS function called *****"}
	
	process{
	
		Write-Host "Importing Modules"

#		#Set the location for the script to run from the working directory.
#		#This allows modules to be imported using relative paths.
#		Set-Location -LiteralPath $ScriptWorkingDirectory

#		#Import the modules
#
#		#Solutions
#		Import-Module ".\Uninstall-Solution.ps1" -ErrorAction:Stop
#		Import-Module ".\Delete-Solution.ps1" -ErrorAction:Stop
#
#		#Feature
#		Import-Module ".\..\Features\Deactivate-Feature.ps1" -ErrorAction:Stop
#
#		#List
#		Import-Module ".\..\Lists\Delete-List.ps1" -ErrorAction:Stop
#
#		#Utilitities
#		Import-Module ".\..\Utilities\Add-SnapIn.ps1" -ErrorAction:Stop

#		$userName = [Environment]::UserName
#		$SolutionManifestFullFilePath = "$SolutionFilesDirectory\$SolutionManifestFileName"
#		[xml]$SolutionManifest = Get-Content $SolutionManifestFullFilePath
		
#		Write-Host "`tScript running under username $userName"
#		Write-Host "`tSolution files directory set to $SolutionFilesDirectory"
#		Write-Host "`tSolution manifest file fullpath is $SolutionManifestFullFilePath"
#		Write-Host "`tWorking Directory set as $ScriptWorkingDirectory"
		
		Write-Host "`tLoading solution manifest file from $SolutionFilesDirectory."
		if($SolutionManifest -ne $null) #We have a solution manifest file.
		{
			Write-Host "Global WebApplication attribute: " $SolutionManifest.SolutionDeployment.WebApplication
			
			#Step 1: Delete lists
			if($SolutionManifest.SolutionDeployment.Lists.ChildNodes.Count -gt 0) # We have some lists to delete.
			{
				Write-Host $SolutionManifest.SolutionDeployment.Lists.ChildNodes.Count " lists to delete"
				
				foreach($list in $SolutionManifest.SolutionDeployment.Lists.List)
				{
					if($list.WebApplications -ne $null)
					{
						foreach($listWebApplication in $list.WebApplications.WebApplication)
						{
							if($list.WebApplications.WebApplication -ne $null)
							{
								Write-Host "`tCalling Delete-List for " $list.Name " at URL " $list.WebApplications.WebApplication
								Delete-List -ListName $list.Name -Url $list.WebApplications.WebApplication
							}
						}
					}
					else
					{
						Write-Host "The solution manifest is missing the required WebApplications element for " $list.Name
					}

				}
			}
			else
			{
				Write-Host "There are no lists to process"
			}
			
			#Step1: Feature Deativation
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
			
			#Step2: Solution Retraction
			if($SolutionManifest.SolutionDeployment.Solutions.ChildNodes.Count -gt 0) # We have some solutions to retract.
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
								$array = $solution.WebApplications.WebApplication
		#						Write-Host "DEBUG: WebApplication = $array"

							}
						
						}
						
					}
					else
					{
						Write-Host "The solution manifest is missing the required WebApplications element for " $solution.Name
					}
					
					Write-Host "`tCalling Uninstall-Solution for" $solution.Name
					Uninstall-Solution -SolutionName $solution.Name -Url $array
					Write-Host "`tCalling Delete-Solution for" $solution.Name
					Delete-Solution -SolutionName $solution.Name
				}
				
			}
			else
			{
				Write-Host "`tError: Although a solution manifest file has been succesfully loaded, there are no solutions to process."
			}
			
			
		
		}
		else #Solution manifest file undefined.
		{
			Write-Host "`tError: There has been a problem loading the SolutionManifest.xml file."
		}
	}
	
	end{
	Write-Host "***** Retract-TCMS function complete *****"}

}

#Retract-TCMS