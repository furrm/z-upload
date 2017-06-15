param(
    [string]$url="http://gsp.intranet.allenovery.com/sites/ssc"
)

function WaitForJobToFinish ([string]$solutionName)    # This function waits for the deployment job to finish before doing the next command.
{     
    $JobName = "*solution-deployment*$solutionName*"    
    $job = Get-SPTimerJob | ?{ $_.Name -like $JobName }    
    if ($job -eq $null)
    {
        Write-Host  -ForeGroundColor Red "Timer job not found."    
    }    
    else    
    {        
        $JobFullName = $job.Name        
        Write-Host -NoNewLine "Waiting to finish job $JobFullName "            
        while ((Get-SPTimerJob $JobFullName) -ne $null)         
        {            
            Write-Host -NoNewLine .            
            Start-Sleep -Seconds 2        
        }
        Write-Host -ForeGroundColor Green " (done)"   
    }
}

function Get-ScriptDirectory
{
    $Invocation = (Get-Variable MyInvocation -Scope 1).Value
    Split-Path $Invocation.MyCommand.Path
}

function Ask-YesOrNo
    {
    param([string]$title="Removed AllenOvery.Applications.SSC.wsp.",[string]$message="Do you want to continue?")
    
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

function Ask-DeploymentType
    {
    param([string]$title="What do you want to do today?",[string]$message="Do you want to Uninstall SSC Solution before Installing it?")
    
    $choiceUninstall = New-Object System.Management.Automation.Host.ChoiceDescription "&Uninstall", "The script will deactivate and uninstall all features and then retract and uninstall the solution."
    $choiceInstall = New-Object System.Management.Automation.Host.ChoiceDescription "&Install", "The script will install and active the features."
    $choiceBoth = New-Object System.Management.Automation.Host.ChoiceDescription "Uninstall then Inst&all", "The script will Uninstall then Install the solution."
    $options = [System.Management.Automation.Host.ChoiceDescription[]]($choiceUninstall, $choiceInstall, $choiceBoth)
    $result = $host.ui.PromptForChoice($title, $message, $options, 0)
        switch ($result)
        {
            0 
            {
            Return "U"
            }
            1 
            {
            Return "I"
            }
            2 
            {
            Return "B"
            }
        }
    }

$uri = [System.Uri]$url
$waUrl = "$($uri.Scheme)://$($uri.Authority)"
$path = Join-Path (Get-ScriptDirectory) AllenOvery.Applications.SSC.wsp

Clear

Write-Host -ForeGroundColor Yellow "Managing the SSC Dashboard WSP"
Write-Host -ForeGroundColor Yellow "======================================"
Write-Host -ForeGroundColor Yellow ""

[string]$msg = "The script will be run against '$url'. Do you want to continue?"

$choice = Ask-YesOrNo "Confirm Script Parameters" $msg
if ($choice -eq $false)
{
    RETURN
}

Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
$snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
if ($snapin -eq $null) {
    Add-PSSnapin "Microsoft.SharePoint.Powershell"
}
Write-Host -ForeGroundColor Green " (done)"

$DeploymentType = Ask-DeploymentType
Write-Host ""
if (($DeploymentType -eq "U") -or ($DeploymentType -eq "B"))
{
    Write-Host -ForegroundColor Yellow "Uninstall currently deployed solution."
    Write-Host -ForegroundColor Yellow ""

    Write-Host "Disabling AllenOvery.Applications.SSC_SSCSurveys $($waUrl)..." -nonewline
    Disable-SPFeature AllenOvery.Applications.SSC_SSCSurveys -Url $url -Confirm:$false #-ErrorAction SilentlyContinue
    Uninstall-SPFeature -identity AllenOvery.Applications.SSC_SSCSurveys -Confirm:$false -Force  #-ErrorAction SilentlyContinue
    Write-Host -ForeGroundColor Green " (done)"

    Write-Host "Disabling AllenOvery.Applications.SSC_SSCWebParts $($waUrl)..." -nonewline
    Disable-SPFeature AllenOvery.Applications.SSC_SSCWebParts -Url $url -Confirm:$false #-ErrorAction SilentlyContinue
    Uninstall-SPFeature -identity AllenOvery.Applications.SSC_SSCWebParts -Confirm:$false -Force #-ErrorAction SilentlyContinue
    Write-Host -ForeGroundColor Green " (done)"

    Write-Host "Uninstalling AllenOvery.Applications.SSC.wsp..." -nonewline
    Uninstall-SPSolution -Identity AllenOvery.Applications.SSC.wsp -WebApplication $waUrl -Confirm:$false #-ErrorAction SilentlyContinue
    Write-Host -ForeGroundColor Green " (done)"
    WaitForJobToFinish "AllenOvery.Applications.SSC.wsp"

    $choice = Ask-YesOrNo "Retracted AllenOvery.Applications.SSC.wsp." "Do you want to continue?`n(Hint: You can check the CA Farm Solutions to ensure it is not deployed anywhere)"
    if ($choice -eq $false)
    {
        RETURN
    }
    Write-Host "Removing AllenOvery.Applications.SSC.wsp..." -nonewline
    Remove-SPSolution -Identity AllenOvery.Applications.SSC.wsp  -Confirm:$false #-ErrorAction SilentlyContinue
    Write-Host -ForeGroundColor Green " (done)"

    #WaitForJobToFinish "AllenOvery.Applications.SSC.wsp"

    $choice = Ask-YesOrNo
    if ($choice -eq $false)
    {
        RETURN
    }
    
} else {
    Write-Host -ForegroundColor Yellow "Skipping uninstall of solution."
}

if (($DeploymentType -eq "I") -or ($DeploymentType -eq "B"))
{
    Write-Host -ForegroundColor Yellow "Installing solution"

    Write-Host "Adding Solution..." -nonewline
    Add-SPSolution $path
    Write-Host -ForeGroundColor Green " (done)"

    #WaitForJobToFinish "AllenOvery.Applications.SSC.wsp"
    $choice = Ask-YesOrNo "Confirm Solution was Added correctly" "Did everything work?"
    if ($choice -eq $false)
    {
        RETURN
    }

    Write-Host "Installing Solution..." -nonewline
    Install-SPSolution AllenOvery.Applications.SSC.wsp -WebApplication $waUrl -GACDeployment -Force
    Write-Host -ForeGroundColor Green " (done)"

    WaitForJobToFinish "AllenOvery.Applications.SSC.wsp"

    $choice = Ask-YesOrNo "Confirm Solution as installed" "Did everything work?"
    if ($choice -eq $false)
    {
        RETURN
    }

    Write-Host "Enabling Feature Survey Event Handler" -nonewline
    Enable-SPFeature AllenOvery.Applications.SSC_SSCSurveys -Url $url
    Write-Host -ForeGroundColor Green " (done)"

    Write-Host "Enabling Feature State of Play Web Parts" -nonewline
    Enable-SPFeature AllenOvery.Applications.SSC_SSCWebParts -Url $url
    Write-Host -ForeGroundColor Green " (done)"
    
} else {
    Write-Host -ForegroundColor Yellow "Skipping install of solution. "
}

Write-Host -ForeGroundColor Green "Finished"