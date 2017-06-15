[CmdletBinding()]
Param(
    [Parameter(Mandatory=$true, Position=1, ParameterSetName="Import")]
    [switch]$import,
    [Parameter(Mandatory=$true, Position=1,ParameterSetName="Export")]
    [switch]$export,
    [Parameter(Mandatory=$true, Position=2, ParameterSetName="Import")]
    [Parameter(Mandatory=$true, Position=2, ParameterSetName="Export")]
    [ValidateNotNullOrEmpty()]
    $url,
    [Parameter(Mandatory=$true, Position=3, ParameterSetName="Import")]
    [Parameter(Mandatory=$true, Position=3, ParameterSetName="Export")]
    [ValidateNotNullOrEmpty()]
    $path,
    [Parameter(ParameterSetName="Import")]
    [Switch] $clearExistingSurveys,
    [Parameter(ParameterSetName="Import")]
    [Switch] $createCountries,
    [Parameter(ParameterSetName="Import")]
    [Switch] $rebuildMenus
)

# Load the Variables
. .\AllenOvery.Applications.SSC.PowerShell.Variables.ps1

# Load the Functions
. .\AllenOvery.Applications.SSC.PowerShell.Functions.ps1

switch ($PsCmdlet.ParameterSetName) {
    "Import" {
        Write-Host -ForegroundColor Yellow "Importing Surveys"
        Write-Host -ForegroundColor Yellow "==================================="

        Import-SSCSurveys -url $url -path "$($directorypath)\$($path)" -clearExistingSurveys:$clearExistingSurveys -createCountries:$createCountries -rebuildMenus:$rebuildMenus
    }
    "Export" {
        Write-Host -ForegroundColor Yellow "Exporting Surveys"
        Write-Host -ForegroundColor Yellow "==================================="

        Export-SSCSurveys -url $url -path "$($directorypath)\$($path)"
    }
}

Write-Host -ForeGroundColor Green "Finished"