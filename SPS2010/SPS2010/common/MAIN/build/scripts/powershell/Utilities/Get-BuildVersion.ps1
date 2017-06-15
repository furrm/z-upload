function Get-BuildVersion
{
	begin{Write-Host "Getting Build Version"}
	process
	{
		$Version =  Get-SPFarm | Select BuildVersion
		Write-Host $Version.BuildVersion
	}
	
}