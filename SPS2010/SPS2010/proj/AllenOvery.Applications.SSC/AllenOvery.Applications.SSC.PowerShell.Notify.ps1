[CmdletBinding(DefaultParameterSetName='Notify')]
Param(
    [Parameter(
        Mandatory=$true, 
        Position=1,
		ParameterSetName="Notify" )]
    [ValidateSet('SSC','OPS','FIN', IgnoreCase = $false)]
    [string[]]$dashboards,
    [Parameter(
		Mandatory=$true, 
		Position=2,
		ParameterSetName="Notify" )]
    [ValidateSet('Open','Reminder','Closed', 'Published', IgnoreCase = $false)]
    [string]$action,
	[Parameter(
		Mandatory=$false, 
		Position=3,
		ParameterSetName="Notify" )]
    [switch]$noEmail,
	[Parameter(
		Mandatory=$true, 
		Position=1, 
		ParameterSetName="Clear")]
    [switch]$clearResponses
)
BEGIN {
    $ErrorActionPreference = 'Stop'
    $conn = $null

    # Load the Variables
    . .\AllenOvery.Applications.SSC.PowerShell.Notify.Variables.ps1

    # Load the Functions
    . .\AllenOvery.Applications.SSC.PowerShell.Notify.Functions.ps1

	switch ($PsCmdlet.ParameterSetName) {
		"Notify" {
			Try {
				#Write-Host -ForegroundColor Yellow "Running Notifications"
				Write-Log -Message "Running Notifications" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				
				if ($noEmail)
				{
					#Write-Host -ForegroundColor Yellow "!! Skipping Emails !!"
					Write-Log -Message "!! Skipping Emails !!" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				}
				#Write-Host -ForegroundColor Yellow "===================================="
				Write-Log -Message "====================================" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
	
				$rptData = (Get-Date -Day 1 -Hour 0 -Minute 0 -Second 0).AddMonths(-1)

				$sub = @{"ReportingDate" = $rptData.ToString("MMMM yyyy"); "Url" = $url; }

				$countries = @()

				Write-Host "Creating SQL Connection"
				$conn = New-Object System.Data.SqlClient.SqlConnection

				$conn.ConnectionString = $sqlConnectionString
				$conn.Open()

				# Create the Command Object and Add the Parameters the Dashboard ID will be set for each Dashboard.
				$cmd = New-Object System.Data.SqlClient.SqlCommand("spSetDashboardTypeStatus", $conn)
				$cmd.CommandType = [System.Data.CommandType]::StoredProcedure

				$cmd.Parameters.Add("@DashboardID", [System.Data.SqlDbType]::Int) | Out-Null
				$cmd.Parameters.AddWithValue("@ReportDate", $rptData.ToString("yyyy-MM-dd")) | Out-Null		
				$cmd.Parameters.AddWithValue("@DashBoardStatus", $action) | Out-Null

				$cmdEmailTemplate = New-Object System.Data.SqlClient.SqlCommand("spGetEmailTemplate", $conn)
				$cmdEmailTemplate.CommandType = [System.Data.CommandType]::StoredProcedure
				$cmdEmailTemplate.Parameters.Add("@ReportID", [System.Data.SqlDbType]::Int) | Out-Null
				$cmdEmailTemplate.Parameters.AddWithValue("@Action", $action) | Out-Null

				$cmdCountry = New-Object System.Data.SqlClient.SqlCommand("spGetCountries", $conn)
				$cmdCountry.CommandType = [System.Data.CommandType]::StoredProcedure
				$rdCountry = $cmdCountry.ExecuteReader()
				#if ($rdCountry -ne $null)
				#{
					while ($rdCountry.Read())
					{
						#$rdCountry["CountryName"].ToString()
						$countries += @{"Code" = $rdCountry["CountryCodeDL"].ToString();  "Name" = $rdCountry["CountryName"].ToString(); }
					}
				#}
				
				$rdCountry.Dispose()
				$cmdCountry.Dispose()
			}
			Catch {
				$ErrorMessage = $_.Exception.Message
				$msg = "Unable to initialise connection to reporting database`n$($ErrorMessage)"
				Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 1
				exit 1
			}
		}
		"Clear" {
			Try {
				#Write-Host -ForegroundColor Yellow "Clearing Data"
				#Write-Host -ForegroundColor Yellow "===================================="
				Write-Log -Message "Clearing Data" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				Write-Log -Message "====================================" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
	
				# Load SharePoint Snapin
				#Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
				Write-Log -Message "Ensuring that SharePoint PowerShell Snapin is present..." -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				
				$snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
				if ($snapin -eq $null) {
					Add-PSSnapin "Microsoft.SharePoint.Powershell"
				}
				#Write-Host -ForeGroundColor Green " (done)"
				Write-Log -Message " (done)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				
			}
			Catch {
				$ErrorMessage = $_.Exception.Message
				$msg = "Unable to load SharePoint module`n$($ErrorMessage)"
				Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 1
				exit 2
			}
		}
	}
}

PROCESS {
	switch ($PsCmdlet.ParameterSetName) {
		"Clear" {
			Try {
				#
				# Deletes all existing surveys - Should be run as part of a new month
				#

				$web = Get-SPWeb $url
				$lists = $web.Lists | Where-Object { $_.BaseType -eq 4 }

				$caml=""
				#optional filter
				#<Where><Eq><FieldRef Name=""ContentType"" /><Value Type=""Text"">Form</Value></Eq></Where>"
 
				$query=new-object Microsoft.SharePoint.SPQuery
				$query.ViewAttributes = "Scope='Recursive'"
				$query.Query=$caml

				$lists | ForEach-Object -Process {
					$list = $_
					$items=$list.GetItems($query)
					#Write-Host "Deleting $($items.Count) items from $($list.Title)"  -nonewline
					Write-Log -Message "Deleting $($items.Count) items from $($list.Title)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				
					$items | % { $list.GetItemById($_.Id).Delete() }
					#Write-Host -ForeGroundColor Green " (done)"
					Write-Log -Message " (done)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				
				}

				$web.Dispose()
				exit 1
			}
			Catch {
				$ErrorMessage = $_.Exception.Message
				$msg = "Unable clear surveys `n$($ErrorMessage)"
				Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 1
				exit 2
			}
		}
		"Notify" {

			#
			# Changes the Status of a Dashboard for the current reporting month i.e. Last Month
			#
            
			Try {
				# For all the Groups get the members, if the group contains a group expand that, get the email and return a sorted distinct list
				$ctype = [System.DirectoryServices.AccountManagement.ContextType]::Domain
				[System.DirectoryServices.AccountManagement.PrincipalContext] $ctx = New-Object -TypeName System.DirectoryServices.AccountManagement.PrincipalContext -ArgumentList $ctype

				Foreach($dashboard in $dashboards) {
					#Write-Host "Processing $($dashboard)"
					Write-Log -Message "Processing $($dashboard)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				
					# Write to SQL The connection object will have not been created if the Action is Reminder
					if ($action -eq "Open" -or $action -eq "Closed" -or $action -eq "Published") 
					{
						#Write-Host "   Setting report type $($dashboard) to $($action)"
						Write-Log -Message "Setting report type $($dashboard) to $($action)" -Level "Info" -Indent 3 -Path $fileName -EventLogName $logName -EventSource $logSource
				
						$cmd.Parameters["@DashboardID"].Value = $dashboardIds[$dashboard]
						$cmd.ExecuteNonQuery() | Out-Null
					}

					# Send Emails
					if (($noEmail.IsPresent -eq $false) -and ($action -eq "Open" -or $action -eq "Reminder" -or $action -eq "Published")) {
					
						$isCountrySpecific = $false
						$reportADGroups = ""
					
						[string]$subject = ""
						[string]$body = ""
						
						Write-Host "Dashboard Id $($dashboardIds[$dashboard])"


						# Get Email Template
						$cmdEmailTemplate.Parameters["@ReportID"].Value = $dashboardIds[$dashboard]
						[System.Data.SqlClient.SqlDataReader]$rdEmailTemplate = $cmdEmailTemplate.ExecuteReader()
					
						while ($rdEmailTemplate.Read())
						{
							$subject = $rdEmailTemplate["Subject"].ToString()
							$body = $rdEmailTemplate["Body"].ToString();
							$isCountrySpecific = [bool]$rdEmailTemplate["CountrySpecific"]

							Write-Host "isCountrySpecific $($isCountrySpecific)"

							[string]$reportADGroups = $rdEmailTemplate["ReportADGroups"].ToString()

							if ($sub.ContainsKey('ReportName')) {
								$sub.Set_Item("ReportName", $rdEmailTemplate["ReportName"].ToString())
							} else {
								$sub.Add("ReportName", $rdEmailTemplate["ReportName"].ToString())
							}

							if ($sub.ContainsKey('ReportUrl')) {
								$sub.Set_Item("ReportUrl", $rdEmailTemplate["ReportURL"].ToString().Replace(" ", "%20"))
							} else {
								$sub.Add("ReportUrl", $rdEmailTemplate["ReportURL"].ToString().Replace(" ", "%20"))
							}

							[string]$v = ""
							if ($rdEmailTemplate["ReplyToName"] -ne [System.DBNull]::Value)
							{
								$v = $rdEmailTemplate["ReplyToName"].ToString()
							}

							if ($sub.ContainsKey('ReplyToName')) {
								$sub.Set_Item("ReplyToName", $v)
							} else {
								$sub.Add("ReplyToName", $v)
							}

							$v = ""
							if ($rdEmailTemplate["ReplyToEmail"] -ne [System.DBNull]::Value)
							{
								$v = $rdEmailTemplate["ReplyToEmail"].ToString()
							}

							if ($sub.ContainsKey('ReplyToEmail')) {
								$sub.Set_Item("ReplyToEmail", $v)
							} else {
								$sub.Add("ReplyToEmail", $v)
							}
						}
						$rdEmailTemplate.Dispose()
					
						#Write-Host "   Sending $($dashboard) $($action) Email"
						Write-Log -Message "Sending $($dashboard) $($action) Email" -Level "Info" -Indent 3 -Path $fileName -EventLogName $logName -EventSource $logSource
				
						[string[]]$to = @()
						#[string[]]$to = @("simon@s.com", "simon@s.com", "Richard.Bolton@aoglobal.uat", "George.Ferguson@aoglobal.uat", "Diarmuid.Brogan@aoglobal.uat")

						[string]$s = ""
						[string]$b = ""
					
						#$groups = @("XADM_L_3E_Full_Admin_INS3")
						$groups = @()
	
						if ($isCountrySpecific)
						{
							ForEach($item in $countries) {
								if ($action -eq "Open" -or $action -eq "Reminder")
								{
									$groups += @("XUSR_L_SSCDashBoards_$($dashboard)_DataContributor_$($item.Code)")
								} 
								else 
								{
									$groups += @("XUSR_L_SSCDashBoards_$($dashboard)_Recipients_$($item.Code)")
								}
							}
						} 
						else 
						{
							# Add Data Contributors
							if ($action -eq "Open" -or $action -eq "Reminder") {
								$groups  = $groups += @("XUSR_L_SSCDashBoards_$($dashboard)_DataContributor")
							} else {
								$groups = $groups += @("XUSR_L_SSCDashBoards_$($dashboard)_Recipients")
							}
						}

						$s = Substitute-Text -text $subject -sub $sub
						$b = Substitute-Text -text $body -sub $sub
					
						#$groups | % { Write-Host "'$($_)'" }

						$groups | ForEach-Object {
	
							[string]$group = $_
							#Write-Host "Parsing $($group)..."
							Write-Log -Message "Parsing $($group)..." -Level "Info" -Indent 6 -Path $fileName -EventLogName $logName -EventSource $logSource
				
							[System.DirectoryServices.AccountManagement.GroupPrincipal] $grp =  [System.DirectoryServices.AccountManagement.GroupPrincipal]::FindByIdentity($ctx, $group)
	
							if ($grp -ne $null) {
								$grp.GetMembers($true) | ForEach-Object {
									#Write-Host "Getting $($_.Name)..."

									#[System.DirectoryServices.AccountManagement.Principal] $p = $_
									[System.DirectoryServices.AccountManagement.UserPrincipal] $u = [System.DirectoryServices.AccountManagement.UserPrincipal]$_

									if ($u.EmailAddress.Length -gt 0)
									{
										#Uncomment this when ready
										$to += "$($u.EmailAddress)"
									}
								}
				
								#$grp.Dispose()
							} else {
								#Write-Host "$($group) not found!!!"
								Write-Log -Message "$($group) not found!!!" -Level "Warn" -Indent 6 -Path $fileName -EventLogName $logName -EventSource $logSource
							}
						}
	   
						# Remove dups.
						$to = $to | select -uniq

						# uncomment to view email addresses
						#$to | % { Write-Host "'$($_)'" }

						if ($to.Count -gt 0) {
                    
							$anon = "anonymous"
							$anonPass = ConvertTo-SecureString "anonymous" -AsPlainText -Force
							$anonCred = New-Object System.Management.Automation.PSCredential($anon, $anonPass)
							try {
							  Send-MailMessage -To $from -Bcc $to -Subject $s -Body $b -SmtpServer $smtpServer -From $from -BodyAsHtml -Encoding ([System.Text.Encoding]::UTF8) -Credential $anonCred
							} catch {
								#Write-Host "An error did occur, but we are continuing!"
								Write-Log -Message "An error did occur, but we are continuing!" -Level "Warn" -Indent 6 -Path $fileName -EventLogName $logName -EventSource $logSource
				
							}
						} else {
							#Write-Host "   $([string]::join(", ", $groups)) contained no one to email"
							Write-Log -Message "$([string]::join(", ", $groups)) contained no one to email" -Level "Warn" -Indent 3 -Path $fileName -EventLogName $logName -EventSource $logSource
						}
					}
				}
            
				$ctx.Dispose()
				exit 1
			}
			Catch {
				$ErrorMessage = $_.Exception.Message
				$msg = "Unable to set state`n$($ErrorMessage)"
				Write-Log -Message $msg -Level "Error" -Path $fileName -EventLogName $logName -EventSource $logSource -EventID 1
				exit 2
			}
		}
	}
}
END { 
    switch ($PsCmdlet.ParameterSetName) {
		"Notify" {

			if ($cmdEmailTemplate -ne $null)
			{
				$cmdEmailTemplate.Dispose()
			}

			if ($cmd -ne $null)
			{
				$cmd.Dispose()
			}

			if ($conn -ne $null) {
				#Write-Host "Closing SQL Connection"
				Write-Log -Message "Closing SQL Connection" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				if ($conn.State -eq [System.Data.ConnectionState]::Open) { 
						$conn.Close()
				}	 

				$conn.Dispose()
				$conn = $null
			}
		}
	}

	#Write-Host -ForeGroundColor Green "Finished"
	Write-Log -Message "Finished" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
				
}