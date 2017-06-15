$invocation = (Get-Variable MyInvocation).Value
$directorypath = Split-Path $invocation.MyCommand.Path

function Export-SSCSurveys
{
   [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        $url,
        [Parameter(Mandatory=$true, Position=2)]
        $path
    )

    If (Test-Path "$($directorypath)\map.csv") 
    {
        Remove-Item "$($directorypath)\map.csv"
    }
    
    If (Test-Path $path) 
    {
        Remove-Item $path
    }
    
    Add-Content "$($directorypath)\map.csv" "Id,Title,MappedId"

    # Get a handle to the Profile Manager.
    # Load SharePoint Snapin
    Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
    $snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
    if ($snapin -eq $null) {
        Add-PSSnapin "Microsoft.SharePoint.Powershell"
    }
    Write-Host -ForeGroundColor Green " (done)"
    
    
    $web = Get-SPWeb $url
    $lists = $web.Lists | Where-Object { $_.BaseType -eq 4 }
    
    $xdoc = New-Object System.Xml.XmlDocument
    
    $xdoc.LoadXML('<Surveys></Surveys>')
    $xroot = $xdoc.DocumentELement 
    
    $refLists = @{}
    
    $lists | ForEach-Object -Process { 
    
        [xml]$list = $_.PropertiesXml
        $l = $xdoc.ImportNode($list.DocumentElement, $true)
        
        #Write-Host $_.Title
        $fields = $_.Fields | Where-Object { $_.CanBeDeleted -eq $true }
        $fields | ForEach-Object -Process { 
           [xml]$field = $_.SchemaXml
           $f = $xdoc.ImportNode($field.DocumentElement, $true)
           $l.AppendChild($f)  | Out-Null
           #Write-Host "   $($_.Title)"

           if ($_.Type -eq "Lookup") {
             $id = $field.DocumentElement.List
             if ($refLists.$id -eq $null) { 
                    $guid = [GUID]($field.DocumentElement.List)
                    $lookupList = $web.Lists[$guid]
                    $refLists.$id = $lookupList.Title
             }
           }
        }
        
        $xroot.AppendChild($l) | Out-Null
    }
    
    $xdoc.Save($path)
    
    $refLists.GetEnumerator() | Sort-Object Name |
    ForEach-Object { "{0},{1}," -f $_.Name,$_.Value } |
    Add-Content "$($directorypath)\map.csv"
}    

function Import-SSCSurveys
{
   [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        $url,
        [Parameter(Mandatory=$true, Position=2)]
        $path,
        [Switch] $clearExistingSurveys,
        [Switch] $createCountries,
        [Switch] $rebuildMenus
    )
    
    $xdoc = New-Object System.Xml.XmlDocument
    $xdoc.Load($path)
 
    # Get a handle to the Profile Manager.
    # Load SharePoint Snapin
    Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
    $snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
    if ($snapin -eq $null) {
        Add-PSSnapin "Microsoft.SharePoint.Powershell"
    }
    Write-Host -ForeGroundColor Green " (done)"
    
    $web = Get-SPWeb $url
    $webId = $web.Id
    $mappedIds = Import-CSV "$($directorypath)\map.csv"
    
    # Ensure that all Lookup Tables are created and get the ID so we can map "Id,Title,MappedId"
    $mappedIds | ForEach-Object {
        if ($_ -ne $null) {
            $list = $web.Lists.TryGetList($_.Title)
            $id = ""
            if ($list -eq $null)
            {
                # Create Survey
                $id = $web.Lists.Add($_.Title, "", [Microsoft.SharePoint.SPListTemplateType]::GenericList)

                # Add default Data
                $data = @()

                if ($_.Title -eq "Client Offices") {
                    $data = $data + $defaultClientOffices
                } elseif ($_.Title -eq "Clients") {
                    $data = $data + $defaultClients
                } elseif ($_.Title -eq "Departments") {
                    $data = $data + $defaultDepartments
                }

                #$data.Count
                if ($data.Count -gt 0)
                {
                    $list = $web.Lists.TryGetList($_.Title)
                    $data | ForEach-Object {
                        $newItem = $list.Items.Add()
                        $newItem["Title"] = $_
                        $newItem.Update()
                    }
                }
            } else {
                $id = "$($list.Id)"
            }

            # Store new Id of Lookup list
            $_.MappedId = $id
        }
    }

    if ($rebuildMenus -or $clearExistingSurveys) {

        Write-Host -ForeGroundColor Yellow "Deleting Quick Launch Links" -nonewline
        $ql = $web.Navigation.QuickLaunch
        $Nodes = @()
        $ql | ForEach-Object {
            $Nodes = $Nodes + $_.Id
        }

        $Nodes | ForEach-Object {
            $Node = $web.Navigation.GetNodeById($_)
            $Node.Delete()
        }
    
        $web.Update()

        $ql = $web.Navigation.QuickLaunch

        #Create Headings
        Write-Host -ForeGroundColor Yellow "Creating Quick Launch Headings" -nonewline
        
        foreach($item in $dashboardTypes.KEYS.GetEnumerator()) {
            if ($item -eq "FIN") {
                foreach($c in $countries.KEYS.GetEnumerator()) {
                    $heading = New-Object Microsoft.SharePoint.Navigation.SPNavigationNode( $dashboardTypes[$item].Title.Replace("{country}",$countries[$c].Title) ,"")
                    $ql.AddAsLast($heading) | Out-Null
                }
            } else {
                $heading = New-Object Microsoft.SharePoint.Navigation.SPNavigationNode( $dashboardTypes[$item].Title ,"")
                $ql.AddAsLast($heading) | Out-Null

            }
        }
        
        $web.Update()
        Write-Host -ForeGroundColor Green " (done)"
    }

    if ($clearExistingSurveys) {
        Write-Host -ForeGroundColor Yellow "Deleting existing Surveys" -nonewline
        $ids = @()
        $web.Lists | ForEach-Object {
            if ($_.BaseType -eq [Microsoft.SharePoint.SPBaseType]::Survey) {
                $ids = $ids	+ $_.ID
            }
        }

        $ids | ForEach-Object {  $web.Lists.Delete($_) }
        Write-Host -ForeGroundColor Green " (done)"
        
        $web.Update()
        Write-Host -ForeGroundColor Green " (done)"
        #return
    }

    $xdoc.Surveys.List | ForEach-Object {
        $title = [string]$_.Title
        $description = [string]$_.Description
        $fields = $_.Field.Clone()
    
        if ($title -like "*(Country)") {
            if ($createCountries -eq $true) {
                foreach($item in $countries.KEYS.GetEnumerator()) {
                    Create-List -web $web -title $title.Replace("(Country)", "($($countries[$item].Title))") -description $description.Replace("(Country)", "($($countries[$item].Title))") -fields $fields -mapped $mappedIds -country $item
                }
            }
        } else {
            if ($createCountries -eq $false) {
                Create-List -web $web -title $title -description $description -fields $fields -mapped $mappedIds
            }
        }
    }
}

function Fix-CountryField() {
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        [string]$name,
        [Parameter(Mandatory=$true, Position=2)]
        $country
    )

    if ($country -ne $null) {
        #$metricPattern = New-Object [System.Text.RegularExpressions]::Regex("(?<Ref>(?<Prefix>#)(?<Type>R|L|I)?(?<Metric>[\d.]*))", [System.Text.RegularExpressions]::RegexOptions.CultureInvariant | [System.Text.RegularExpressions]::RegexOptions.Compiled);

        $matches = [regex]::matches($name, "(?<Ref>(?<Prefix>#)(?<Type>R|L|I)?(?<Metric>[\d.]*))")

        # Loop though the matches and mulitple the metric number
        foreach ($match in $matches)
        {
            try {
                $ref = $match.Groups["Ref"].Value

                [int32]$mod = [int32]::Parse($country.Modifier)
                [double]$metric = [double]::Parse($match.Groups["Metric"].Value)

                [double]$countryMetric = $metric

                # Leave any number that is less than 5000
                if ($metric -ge 5000) {
                    # Add modifier so ALL will all be 5000s, AMS 10000s etc
                    $countryMetric += $mod
                }

                # Rebuild the Reference string
                $replace = $match.Groups["Prefix"].Value + $match.Groups["Type"].Value + $countryMetric
                $name = $name.Replace($ref, $replace)
            } catch {
                Write-Host -ForeGroundColor Red $match
            }
        }

        # Replace any £ signs
        $name = $name.Replace("£",  $country.Currency)
    }

    return $name
}

function Create-List() {
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        $web,
        [Parameter(Mandatory=$true, Position=2)]
        $title,
        [Parameter(Mandatory=$true, Position=3)]
        $description,
        [Parameter(Mandatory=$true, Position=4)]
        $fields,
        [Parameter(Mandatory=$true, Position=5)]
        $mapped,
        [Parameter(Mandatory=$false, Position=6)]
        $country
    )
    
    $d = $hierarchy[$title]

    if ($d -ne $null) {
        Write-Host "Starting Create_List $($title)"
        $list = $web.Lists.TryGetList($title)
        if ($list -eq $null)
        {
            Write-Host "Creating Survey $($title)..." -nonewline
            $id = $web.Lists.Add($title, $description, [Microsoft.SharePoint.SPListTemplateType]::Survey)
            $list = $web.Lists[$title]
            Write-Host -ForeGroundColor Green " (done)"	
        } else {
            Write-Host -ForeGroundColor Green "$($title) already exists"
        }
        
        $fields | ForEach-Object {

            $fieldXML = "$($_.OuterXml)"

            $Doc = New-Object System.Xml.XmlDocument  
            $Doc.LoadXml($fieldXML.Replace(" />", "></Field>")) 

            $field = $Doc.DocumentELement 

            if ($country) {
                [string]$newDisplayName = Fix-CountryField -name $field.DisplayName -country $countries[$country]
                $field.DisplayName = $newDisplayName
            }

            if ($list.Fields.ContainsField($field.DisplayName) -eq $false) {
                if ($field.Type -eq "Lookup")
                {
                    $oldListId = $_.List
                    $newListId = ""
                    $map = $mapped | ForEach-Object {
                        if ([GUID]($_.Id) -eq [GUID]($oldListId))
                        {
                            $newListId = $_.MappedId
                        }
                    }
                
                    $field.List = "$($newListId)"
                    $field.SourceID	 = "$($webId)"
                }

                Write-Host "   Creating Question $($field.DisplayName)..." -nonewline
                $list.Fields.AddFieldAsXml($field.OuterXml)  | Out-Null
                Write-Host -ForeGroundColor Green " (done)"	
            }
        }
    
        $list.AllowMultiResponses = $true
        $list.BreakRoleInheritance($false)
        # Add Security Groups Here 

        $securityGroups = @()
        if ($d.DashboardType -eq "FIN") {

			if ($country -eq $null)
			{
				$country = $d.Country
			}

            $securityGroups = $securityGroups + @("XUSR_L_SSCDashboards_$($d.DashboardType)_DataContributor_$($country)", "XUSR_L_SSCDashboards_$($d.DashboardType)_DataOwner_$($country)")
        } else {
            $securityGroups = $securityGroups + @("XUSR_L_SSCDashboards_$($d.DashboardType)_DataContributor", "XUSR_L_SSCDashboards_$($d.DashboardType)_DataOwner")
        }

        ForEach($groupName in $securityGroups) {
            $group = "$($domain)\$($groupName.ToLower())"
            $account = $null
            try { 
                $account = $web.EnsureUser($group)
            } catch {
                Write-Host -ForeGroundColor Red "Unable to find group $($groupName)"
            }

            # Add the Groups to Contribute!
            if ($account -ne $null) {
                $roleDefinition = $web.RoleDefinitions["Contribute"]
                $roleAssignment = New-Object Microsoft.SharePoint.SPRoleAssignment($account)
                $roleAssignment.RoleDefinitionBindings.Add($roleDefinition)

                $list.RoleAssignments.Add($roleAssignment)
            }
        }

        # Ensure that Owners Group is added back in.
        $roleDefinition = $web.RoleDefinitions["Full Control"]
        $roleAssignment = new-object Microsoft.SharePoint.SPRoleAssignment($web.AssociatedOwnerGroup)
        $roleAssignment.RoleDefinitionBindings.Add($roleDefinition)

        $list.RoleAssignments.Add($roleAssignment)

        $list.ReadSecurity = 1	# All users have Read access to all items. 
        $list.WriteSecurity = 1 # All users can modify all items
        $list.NoCrawl = $true

        # Set List Property with the 'Type'
        [System.Collections.Hashtable]$ht = $list.RootFolder.Properties
        if ($ht.ContainsKey("SSCDashboardType"))
        {
            $ht["SSCDashboardType"] = $d.ReportID
        } else {
            $ht.Add("SSCDashboardType", $d.ReportID)
        }
        
        $list.RootFolder.Update()

        $list.Update()

        $nodeId = $null
        [string]$headerTitle = $dashboardTypes[$hierarchy[$list.Title].DashboardType].Title

        #$headerTitle

        if ($country -ne $null) {
            $headerTitle = $headerTitle.Replace("{country}",$countries[$country].Title)
        } 

        #$headerTitle

        try {
            $ql = $web.Navigation.QuickLaunch
            $ql | ForEach-Object {
                if ($_.Title -eq $headerTitle) {
                    $nodeId = $_.Id
                }
            }
        } catch {

        }
        
        if ($nodeId -ne $null) {
            $node = $web.Navigation.GetNodeById($nodeId)

            $nl = $node.Children
            $nodeTitle = $list.Title
            if ($country -ne $null) {
                $nodeTitle = $nodeTitle.Replace(" ($($countries[$country].Title))","")
            } 

            $link =  New-Object Microsoft.SharePoint.Navigation.SPNavigationNode($nodeTitle, $list.Views["All Responses"].Url)
                
            if ($nl -eq $null) {
                $nl.AddAslast($link) | Out-Null
            } else {
                [bool]$found = $false
                $nl | ForEach-Object {
                    if ($_.Url	-eq $link.Url)
                    {
                        $found = $true
                    }	
                }

                if ($found -eq $false) {
                    $nl.AddAslast($link) | Out-Null
                }
            }
        }
    } else {
        Write-Host -ForeGroundColor Yellow "$($title) is not needed!"
    }
    
}