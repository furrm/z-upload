param(
[Parameter(Mandatory=$true, Position=0)]
	[ValidateNotNullOrEmpty()]
	[string]$SourceDirectory,
	[Parameter(Mandatory=$true, Position=1)]
	[ValidateNotNullOrEmpty()]
	[string]$DestinationDirectory
)
#$SourceDirectory = "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS"
#$DestinationDirectory = "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\solutuionFiles"

function Copy-SolutionFiles()
{
	begin{Write-Host "`tCopy-SolutionFiles function called."}
	process
	{
		Copy-Item $_.FullName $DestinationDirectory
	}
	end{Write-Host "`tCopy-SolutionFiles function complete."}
	
}

Write-Host "Source directory set to $SourceDirectory."
Write-Host "Destination directory set to $DestinationDirectory."
Set-Location -LiteralPath $SourceDirectory
Get-ChildItem -Recurse | Where-Object {$_.Name -like "*.wsp"}|Copy-SolutionFiles
