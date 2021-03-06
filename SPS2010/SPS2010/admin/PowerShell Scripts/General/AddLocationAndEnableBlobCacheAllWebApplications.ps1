#############################################
##                                         ##
## Change BlobCache settings in web.config ##
## Written by Paul Turner v 0.1            ##
##                                         ##
#############################################

#############################################
##                                         ##
## Do not change below this point          ##
##                                         ##
#############################################

Clear

Write-Host "Adding Microsoft SharePoint Cmdlets if required..." -ForegroundColor Green
Add-PSSnapin Microsoft.SharePoint.PowerShell -EA 0


$WebApps = Get-SPWebApplication #Get All Web Applications
Write-Host "Please select a web application..." -ForegroundColor Cyan
$Selection = 1
Do {
    Write-Host $Selection "-" $WebApps[$Selection-1].DisplayName -ForegroundColor Cyan
    $Selection = $Selection +1
    }
    While ($Selection -le $WebApps.Count)

$Choice = $Null
$Choice = Read-Host 
$Selection = $Choice -1
$WebApplication = $WebApps[$Selection]

If ($Choice -le $WebApps.Count){
    Write-Host "You have chosen" $WebApplication.DisplayName -ForegroundColor Green
    }
Else {
    Write-Host "Invalid selection!" -ForegroundColor Green
    Break
    }
    
Write-Host "1. Add BlobCache entries for location and enable" -ForegroundColor Cyan
Write-Host "2. Remove BlobCache entries for location and disable" -ForegroundColor Cyan
Write-Host "3. Display existing web.config modifications" -ForegroundColor Cyan
$Choice = Read-Host 

If ($Choice -eq "1"){
    Write-Host "Adding web.config settings for application" $WebApplication.DisplayName -ForegroundColor Green
    $Config1 = New-Object Microsoft.SharePoint.Administration.SPWebConfigModification
    $Config1.Path = "configuration/SharePoint/BlobCache"
    $Config1.Name = "enabled"
    $Config1.Owner = "Added by " + [Environment]::UserDomainName + "\" + [Environment]::UserName + " via PowerShell"
    $Config1.Value = "true"
    $Config1.Sequence = 0
    ## SPWebConfigModificationType.EnsureChildNode -> 0 
    ## SPWebConfigModificationType.EnsureAttribute -> 1 
    ## SPWebConfigModificationType.EnsureSection -> 2 
    $config1.Type = 1
    $WebApplication.WebConfigModifications.Add($Config1)
    $WebApplication.Update()

    $Config2 = New-Object Microsoft.SharePoint.Administration.SPWebConfigModification
    $Config2.Path = "configuration/SharePoint/BlobCache"
    $Config2.Name = "location"
    $Config2.Owner = "Added by " + [Environment]::UserDomainName + "\" + [Environment]::UserName + " via PowerShell"
    $Config2.Value = "D:\SharePoint\BlobCache"
    $Config2.Sequence = 0
    ## SPWebConfigModificationType.EnsureChildNode -> 0 
    ## SPWebConfigModificationType.EnsureAttribute -> 1 
    ## SPWebConfigModificationType.EnsureSection -> 2 
    $config2.Type = 1
    $WebApplication.WebConfigModifications.Add($Config2)
    $WebApplication.Update()
    $WebApplication.Parent.ApplyWebConfigModifications() #Apply changes to farm
}

If ($Choice -eq "2"){
    Write-Host "Removing web.config settings for application" $WebApplication.DisplayName -ForegroundColor Green
    $Config1 = $WebApplication.WebConfigModifications | ? {$_.Name -eq "enabled"} #remove enabled
    $WebApplication.WebConfigModifications.Remove($Config1)
    $WebApplication.Update()
    $Config2 = $WebApplication.WebConfigModifications | ? {$_.Name -eq "location"} #remove location
    $WebApplication.WebConfigModifications.Remove($Config2)
    $WebApplication.Update()
    $WebApplication.Parent.ApplyWebConfigModifications() #Apply changes to farm
}

If($Choice -eq "3"){
    Write-Host "Existing web.config modifications for application" $WebApplication.DisplayName -ForegroundColor Green
    $WebApplication.WebConfigModifications
}




   