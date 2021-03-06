<#  
.SYNOPSIS  
    Script to set User Profile Properties that are not managed via the link to AD

.DESCRIPTION  
    Reads the HR feed from PeopleSoft and loops through all the users and if an entry for that Login exists write properties e.g. RoomNumber to the profile
    
.NOTES  
    File Name      : UpdateProfileDetails.ps1  
    Author         : Simon Phillips (Parity)
#>

#
# Start Parameters
#
    $siteUrl = "http://ddvm0277-Unity1"     #"http://thebridge.intranet.allenovery.com"                         # Site Collection
    $domainName = "OMNIAD"
    $connectionString = "Data Source=.;Integrated Security=TRUE;Initial Catalog=UPS_BCS"
#
# End Parameters
#
function Get-ScriptDirectory
{
    $Invocation = (Get-Variable MyInvocation -Scope 1).Value
    Split-Path $Invocation.MyCommand.Path
}

Clear
    $controlFile = Join-Path (Get-ScriptDirectory) UPSSync.txt
    if ((test-path -Path $controlFile) -eq $false)
    {
        Write-Host -ForeGroundColor Red "Unable to locate $($controlFile) to set the last time this script was run."
        exit
    }
    
    # Load SharePoint Snapin
    Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
    $snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
    if ($snapin -eq $null) {
        Add-PSSnapin "Microsoft.SharePoint.Powershell"
    }
    Write-Host -ForeGroundColor Green " (done)"
    
    #Get site objects and connect to User Profile Manager service
    Write-Host -ForeGroundColor Green " (done)" (Measure-Command {
        Write-Host "Getting UPS..." -nonewline
        $site = Get-SPSite $siteUrl
        $context = Get-SPServiceContext $site
        $profileManager = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($context) 
    })

    #$controlFile
    $lastDate = get-content $controlFile
    $date = Get-Date  #This is used to write back to the ProcessingInfo table which will filter the query
    
    Write-Host -ForeGroundColor Green " (done)" (Measure-Command {
        Write-Host "Getting Extended Profile Data..." -nonewline
        $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
        $SqlConnection.ConnectionString = $connectionString
        
        if (-not ($SqlConnection.State -like "Open")) { $SqlConnection.Open() }
        $sql = "Select '$($domainName)\'+ OMNIA_ID as UserName, "
        $sql += "AOX_ROOM_NBR + CASE WHEN LEN(AOX_ROOM_NBR) > 0 AND LEN(AOX_DESK_POSN) > 0 THEN '-' ELSE '' END + AOX_DESK_POSN as RoomNumber "
        $sql += "From SVC_STAFFLST_VW WHERE EMPL_STATUS_DESCR <> 'Terminated' AND OMNIA_ID <> '' AND SYNCDTTM > N'$($lastDate)'"
        
        $SqlCmd = New-Object System.Data.SqlClient.SqlCommand $sql, $SqlConnection
     
        $SqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
        $SqlAdapter.SelectCommand = $SqlCmd
     
        $ds = New-Object System.Data.DataSet
        $SqlAdapter.Fill($ds) | Out-Null
    })
    
    Write-Host -ForeGroundColor Green "(done)" (Measure-Command {
        Write-Host "Updating modified profile data..."
        foreach($a in $ds.Tables[0])
        {
          if ($profileManager.UserExists($a.UserName))
            {
                #Get user profile and change the value
                Write-Host "   $($a.UserName) - Writing to $($a.RoomNumber) room number" -nonewline
                $up = $profileManager.GetUserProfile($a.UserName)
                
                # Set Properties here.
                $up["ao.RoomNumber"].Value = $a.RoomNumber
                
                $up.Commit()
                Write-Host -ForeGroundColor Green " (done)"
            }
            else
            {
                Write-Host -ForeGroundColor Red "   $($a.UserName) - Profile Not Found"
            } 
        }
    })
    
    #Write DateTime
    "{0:yyyy-MM-dd HH:mm:ss}" -f $date | out-file -encoding ASCII $controlFile
    
    #Write-Host -ForeGroundColor Green " (done)" (Measure-Command {
    #    Write-Host "Updating process date..." -nonewline
    #    $sql = "UPDATE [ProcessInformation] SET [LastProcessData] = N'$("{0:yyyy-MM-dd HH:mm:ss}" -f $date)'"
    #    $sqlCmdUpdate = New-Object System.Data.SqlClient.SqlCommand $sql, $SqlConnection
    #    $sqlCmdUpdate.ExecuteNonQuery() | Out-Null
    #})
    
    $SqlConnection.Close()
    $SqlConnection.Dispose()

    #Dispose of site object
    $site.Dispose() 
