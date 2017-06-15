function Activate-Feature()
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
	begin{Write-Host "Activate-Feature function called"}
	process{
		
		$installedFeature = Get-SPFeature|?{$_.DisplayName -like "$FeatureName"}
		
		if($installedFeature -ne $null) #Feature installed
		{
			Enable-SPFeature -Identity $FeatureName -Url $Url -Force -Confirm:$false
		}
		else #Feature not installed
		{
			Write-Host [string]::Format("Feature {0} is not installed so therefore cannot be activated", $FeatureName)
		}
	}
	end{Write-Host "Activate-Feature function complete"}
	
}