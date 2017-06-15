 $area = "SSC Dashboard"
 
 # Load SharePoint Snapin
    $snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
    if ($snapin -eq $null) {
        Write-Host "Loading SharePoint PowerShell Snapin"
        Add-PSSnapin "Microsoft.SharePoint.Powershell"
    }

[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Practices.ServiceLocation") | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Practices.SharePoint.Common") | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Practices.SharePoint.Common.ServiceLocation") | Out-Null

$serviceLocator = [Microsoft.Practices.SharePoint.Common.ServiceLocation.SharePointServiceLocator]::GetCurrent()
$configManager = $serviceLocator.GetInstance([Microsoft.Practices.SharePoint.Common.Configuration.IConfigManager])

#Create a List<DiagnosticsArea> to collect the Diagnostics Area
$areaCollection = New-Object 'System.Collections.Generic.List[Microsoft.Practices.SharePoint.Common.Logging.DiagnosticsArea]' 

#Add a DiagnosticsArea with the name Custom Area
$customArea = New-Object 'Microsoft.Practices.SharePoint.Common.Logging.DiagnosticsArea' -ArgumentList $area

$customArea.DiagnosticsCategories.Add((New-Object 'Microsoft.Practices.SharePoint.Common.Logging.DiagnosticsCategory'("Warning", ([Enum]::Parse([Microsoft.SharePoint.Administration.EventSeverity], 'Warning')), ([Enum]::Parse([Microsoft.SharePoint.Administration.TraceSeverity], 'Medium')))))
$customArea.DiagnosticsCategories.Add((New-Object 'Microsoft.Practices.SharePoint.Common.Logging.DiagnosticsCategory'("Error", ([Enum]::Parse([Microsoft.SharePoint.Administration.EventSeverity], 'Error')), ([Enum]::Parse([Microsoft.SharePoint.Administration.TraceSeverity], 'Medium')))))
$customArea.DiagnosticsCategories.Add((New-Object 'Microsoft.Practices.SharePoint.Common.Logging.DiagnosticsCategory'("Information", ([Enum]::Parse([Microsoft.SharePoint.Administration.EventSeverity], 'Information')), ([Enum]::Parse([Microsoft.SharePoint.Administration.TraceSeverity], 'Medium')))))

$areaCollection.Add($customArea)

$configuredAreas = New-Object 'Microsoft.Practices.SharePoint.Common.Logging.DiagnosticsAreaCollection' $configManager 
Write-Host "Current Configured Diagnostics Areas"
$configuredAreas

#loop through the newly collection of diagnosticsareas
$areaCollection | % { 	
    #get the instance from the current configuration	
    $existingArea = $configuredAreas[$_.Name] 	
    
    #if the area the is null, we add add the area from the List<DiagnosticsArea> collection	
    #else we loop through the collection we got from current configuration	
    if($existingArea -eq $null)	{		
        $configuredAreas.Add($_)	
    }	else	{			
        #loop through the collection we got from current configuration		
        $customArea.DiagnosticsCategories | % { 			
            #get the category instance from the $existingArea (DiagnosticsArea)			
            $existingCategory = $existingArea.DiagnosticsCategories[$_.Name]			
            
            #if the category is null, we add to the current configuration			
            if($existingCategory -eq $null) {
                $existingArea.DiagnosticsCategories.Add($_);			
            }		
        }	
     }
}
#save the current configuration
$configuredAreas.SaveConfiguration()

# call the registration method to ensure all registered diagnostic areas are also registered as event sources
[Microsoft.Practices.SharePoint.Common.Logging.DiagnosticsAreaEventSource]::EnsureConfiguredAreasRegistered()