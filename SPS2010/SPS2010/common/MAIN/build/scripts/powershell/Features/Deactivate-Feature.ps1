function Deactivate-Feature()
{
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[ValidateNotNullOrEmpty()]
		[string]$FeatureName
		,
		[Parameter(Mandatory=$true, Position=1)]
		[ValidateNotNullOrEmpty()]
		[string]$Url
	)
	begin{Write-Host "Deactivate-Feature function called"}
	process{
		
		$installedFeature = Get-SPFeature|?{$_.DisplayName -like "$FeatureName"}
		
		if($installedFeature -ne $null) #Feature installed
		{
			Write-Output $installedFeature
			Disable-SPFeature -Identity $FeatureName -Url $Url -Force -Confirm:$false
		}
		else #Feature not installed
		{
			Write-Host [string]::Format("Feature {0} is not installed so therefore cannot be deactivated", $FeatureName)
		}
	}
	end{Write-Host "Deactivate-Feature function complete"}
	
}