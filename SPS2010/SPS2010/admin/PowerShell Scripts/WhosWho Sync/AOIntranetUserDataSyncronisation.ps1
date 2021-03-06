# Load the Variables
. .\AOIntranetUserDataSyncronisation.Variables.ps1

# Load the Functions
. .\AOIntranetUserDataSyncronisation.Functions.ps1

Clear

    [DateTime] $currentDate = (Get-Date)
    
    $ls = Get-AOLastSyncronisationDate -syncdb $syncdb
    if ($?) {
        if ($ls.Error -ne $null) {
            $msg = "Error running Get-AOLastSyncronisationDate`n$($ls.Error.Exception.Message)"
            Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 1
            exit 1
        } else {
            Write-Log -Message "LastDate: $($ls.LastDate)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
        
            [string]$lastSync = $ls.LastDate
            if ($lastSync -eq "")
            {
                $lastSync = "2009-01-01"
            }

            Write-Log -Message "Process Started $($currentDate)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
    
            Write-Log -Message "Photo Import $($currentDate)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
    
            Update-UPSPhotoFromSQLShare -StartDate $lastSync
    
            Write-Log -Message "HR Data Import $($currentDate)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource		
            
            $ds = Get-AOUsersForSyncronisation -hr $psconstr -domain $aodomain -lastDate $lastSync
            if ($?) {
                if ($ds.Error -ne $null) {
                    $msg = "Error running Get-AOUsersForSyncronisation - See Error`n$($ds.Error.Exception.Message)"
                    Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 2
                    exit 2
                } else {
                    $msg = "Output from Get-AOUsersForSyncronisation
========================================================
Staff Records Retrieved: $($ds.StaffRecordsRetrieved)
Relationship Records Retrieved: $($ds.RelationshipRecordsRetrieved)
Out Of Office Records Retrieved: $($ds.OutOfOfficeRecordsRetrieved)
Secondment Records Retrieved: $($ds.SecondmentRecordsRetrieved)"
                    Write-Log -Message $msg -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
                    $o = $ds.DataSet | Import-AOSyncronisationData -url $siteUrl -syncdb $syncdb2
                    if ($?) {
                        if ($o.Error -ne $null) {
                            $msg = "Error running Import-AOSyncronisationData - See Error`n$($o.Error.Exception.Message)"
                            Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 3
                            exit 3
                        } else {
                            $o | Add-Member -type NoteProperty -name CountProfilesNotFoundInUPS -value $o.ProfilesNotFoundInUPS.Length
                            $msg = "Output from Import-AOSyncronisationData
========================================================                            
Stale Records Found: $($o.StaleRecordsFound)
Whos Who Records that need Updating: $($o.ChangesToWhosWhoFlagFound)
Profiles Attempting Reload: $($o.ProfilesAttemptingReload)
Profiles To Load: $($o.ProfilesToLoad)
Out Of Office Records: $($o.OutOfOfficeRecords)
Secondments Records: $($o.SecondmentsRecords)
Profiles Not Found In UPS: $($o.CountProfilesNotFoundInUPS)"
                                
                            Write-Log -Message $msg -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
                            $sl = Set-AOLastSyncronisationDate $currentDate -syncdb $syncdb2
                            if ($?) {
                                if ($sl.Error -ne $null) {
                                    $msg = "Error running Set-AOLastSyncronisationDate - See Error`n$($sl.Error.Exception.Message)"
                                    Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 3
                                    exit 4
                                } else {
                                    Write-Log -Message "Process Finished $(Get-Date)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
                                }
                            } else {
                                $msg = "Error running Set-AOLastSyncronisationDate - Check Parameters"
                                Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 5
                                exit 5
                            }
                        }
                    } else {
                        $msg = "Error running Import-AOSyncronisationData - Check Parameters"
                        Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 6
                        exit 6
                    }
                }
            } else {
                $msg = "Error running Get-AOUsersForSyncronisation - Check Parameters"
                Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 7
                exit 7
            }
        }
    } else {
        $msg = "Error running Get-AOLastSyncronisationDate - Check Parameters"
        Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 8
        exit 8
    }