################
#
#  History
#
#  2014-02-24 - Split Script into Run / Functions and Variables. [Simon Phillips]
#  2014-06-10 - Changes to the Relationship Data. [Simon Phillips]
#
################

function Get-AllFeeEarners
{
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1, HelpMessage='SQLClient connection string to the HR Peoplesoft database.')]
        [Alias('hr')]
        [String]$hrdb_connectionstring,
        [Parameter(Mandatory=$false, Position=2, HelpMessage='Current domain name to append to login names extracted from database.')]
        [Alias('domain')]
        [String]$domainName = "OMNIA",
        [Parameter( Position=3)]
        [String[]]$login
    )
    
    Write-Verbose "Entering Process Method of Get-AllFeeEarners"
    Write-Verbose "Creating SqlClient Objects..."
    $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
    $SqlConnection.ConnectionString = $hrdb_connectionstring
        
    if (-not ($SqlConnection.State -like "Open")) { $SqlConnection.Open() }
    
    Write-Verbose "Creating DataSet..."
    $ds = New-Object System.Data.DataSet("CVData")
    
    $sql = "SELECT [EXT_EMPLID] as EmployeeId, [EXT_DISPLAY_NAME] as DisplayName, '$($domainName)\'+ [OMNIA_ID] as UserName, '' as CVHtml FROM [dbo].[SVC_STAFFLST_VW] WHERE EMPL_STATUS_DESCR <> 'Terminated' AND OMNIA_ID <> '' AND AOX_TIME_RECORDER = 'Y'"
    
    $users = ""
    [System.Data.SqlClient.SqlParameter[]] $params = @()
    if ($login.Length -gt 0) 
    {
        [string[]] $paramNames = @()
        for ($i=0; $i -lt @($login).Length; $i++)
        {
            $paramNames += "@Login$($i)"
            $p = New-Object System.Data.SqlClient.SqlParameter("@Login$($i)", [System.Data.SqlDbType]::NVarChar)
            $p.Value = $login[$i].ToUpper()
            $params += $p
        }
        $users = [String]::Join(",", $paramNames)
    
        $sql += " AND OMNIA_ID IN ($($users))"    
        
    } 
    $cmd = New-Object System.Data.SqlClient.SqlCommand $sql, $SqlConnection   
    if ($login.Length -gt 0) 
    {
        $cmd.Parameters.AddRange($params) | Out-Null
    }
    
    $SqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
    $SqlAdapter.SelectCommand = $cmd
    Write-Host "Getting Fee Earners Data..."
    $SqlAdapter.Fill($ds, "Staff") | Out-Null
    
    if ($cmd -ne $null) {
        $cmd.Dispose()
    }
    
    if ($SqlConnection -ne $null)
    {
        if ($SqlConnection.State -like "Open") { $SqlConnection.Close() }
        $SqlConnection.Dispose()
    }
    Write-Host "Finished getting data from People Soft."
    Write-Verbose "Leaving PROCESS Method of Get-AllFeeEarners"

    return $ds
}

function Get-AOUsersForSyncronisation
{
<#
.SYNOPSIS
Makes calls into the PeopleSoft HR Database and retrieve data which can be written to to other systems such as the GSP User Profile Service
.DESCRIPTION
If a specific user is not passed to the function user details that have recently changed in People soft will be extracted so they can be used in other systems.
.EXAMPLE
Get-PeopleSoftUsers -hr "Data Source=LNSISQL12D;Initial Catalog=HRDDEV;User ID=7;Password=*******" -lastDate "2013-09-20"
.EXAMPLE
Get-PeopleSoftUsers -hr "Data Source=LNSISQL12D;Initial Catalog=HRDDEV;User ID=PS_Service;Password=*******" -login @("vossm", "phillisi") 
.EXAMPLE
Get-PeopleSoftUsers -hr "Data Source=LNSISQL12D;Initial Catalog=HRDDEV;User ID=PS_Service;Password=*******" -domain "OMNIAD" -login @("vossm", "phillisi")
.PARAMETER hrdb_connectionstring
SQLClient connection string to the HR Peoplesoft database.
.PARAMETER domainName
Current Domain name defaults to OMNIA.
.PARAMETER login
(Optional) If a login name is given then the function will return only that user's data.
.PARAMETER lastDate
(Optional) If a last date is given then the function will return only changes in the PS Data from that date.
#>
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1, HelpMessage='SQLClient connection string to the HR Peoplesoft database.')]
        [Alias('hr')]
        [String]$hrdb_connectionstring,
        [Parameter(Mandatory=$false, Position=2, HelpMessage='Current domain name to append to login names extracted from database.')]
        [Alias('domain')]
        [String]$domainName = "OMNIA", 
        [Parameter(Mandatory=$true, ParameterSetName="ByUser", Position=3, HelpMessage='User name to extract from the PS Data.')]
        [String[]]$login,
        [Parameter(Mandatory=$true, ParameterSetName="ByDate", Position=3, HelpMessage='Date in string format (yyyy-mm-dd) which will be used to for changes in the PS Data.')]
        [String]$lastDate
    )

        Write-Verbose "Entering Process Method of Get-AOUsersForSyncronisation"

        $output = New-Object System.Object
        #$output | Add-Member -type NoteProperty -name ProcessDate -value (Get-Date)

        try {
            Write-Verbose "Creating SqlClient Objects..."
            $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
            $SqlConnection.ConnectionString = $hrdb_connectionstring
                
            if (-not ($SqlConnection.State -like "Open")) { $SqlConnection.Open() }
        
            $users = ""
            [System.Data.SqlClient.SqlParameter[]] $params = @()
            if ($PsCmdlet.ParameterSetName -eq "ByUser") 
            {
                [string[]] $paramNames = @()
                for ($i=0; $i -lt @($login).Length; $i++)
                {
                    $paramNames += "@Login$($i)"
                    $p = New-Object System.Data.SqlClient.SqlParameter("@Login$($i)", [System.Data.SqlDbType]::NVarChar)
                    $p.Value = $login[$i].ToUpper()
                    $params += $p
                }
                $users = [String]::Join(",", $paramNames)
            } 
            
            $sql_users = "SELECT [EXT_EMPLID] as EmpolyeeId FROM dbo.[EXT_PERSSYNCMVW] WHERE SYNCDTTM > @SyncDate" 
            $sql_user = "SELECT [EXT_EMPLID] as EmpolyeeId FROM dbo.[SVC_STAFFLST_VW] WHERE OMNIA_ID IN ($($users))"
            
            switch ($PsCmdlet.ParameterSetName) 
            { 
                "ByDate"  { 
                    Write-Host "Getting PS Data by last sync date $($lastDate)"
                    $sqlconstraint = $sql_users
                    $p = New-Object System.Data.SqlClient.SqlParameter("@SyncDate", [System.Data.SqlDbType]::NVarChar)
                    $p.Value = $lastDate
                    $params += $p
                    break
                } 
                "ByUser"  { 
                    Write-Host "Getting PS Data by user $($login)"
                    $sqlconstraint = $sql_user
                    break
                } 
            } 
        
            Write-Verbose "Creating DataSet..."
            $ds = New-Object System.Data.DataSet("ExtendedUPSData")
            $ds.Tables.Add("Staff")
            $ds.Tables.Add("Relationships")
            $ds.Tables.Add("CurrentOutofOffice")
            $ds.Tables.Add("CurrentSecondments")

			$sql = "Select "
			$sql += "	s.[EXT_EMPLID] as EmployeeId, "
			$sql += "	'$($domainName)\'+ OMNIA_ID as UserName, "
			$sql += "	[FIRST_NAME] as FirstName, "
			$sql += "	[LAST_NAME] as LastName, "
			$sql += "	[EXT_DISPLAY_NAME] as DisplayName, "
			$sql += "	[AOX_ELBS_FEI] as FeeEarnerInitials, "
			$sql += "	[BUSINESS_TITLE] as BusinessTitle, "
			$sql += "	[EXT_DEPT_DESCR] as Department, "
			$sql += "	[EXT_LOCATION_DESCR] as Office, "
			$sql += "	AOX_ROOM_NBR + CASE WHEN LEN(AOX_ROOM_NBR) > 0 AND LEN(AOX_DESK_POSN) > 0 THEN '-' ELSE '' END + AOX_DESK_POSN as RoomNumber, "
			$sql += "	[PHONE] as WorkPhone, "
			$sql += "	[PHONE_EXTN] as WorkPhoneExt, "
			$sql += "	'' as OfficeShortCut, "
			$sql += "	[MOBILE_PHONE] as MobilePhone, "
			$sql += "	CASE WHEN LEN([PHONE_EXTN]) > 0 THEN '81' + [PHONE_EXTN] ELSE '' END as MobilePhoneQuickDial, "
			$sql += "	CASE WHEN DATEDIFF(month, [HIRE_REHIRE_DT], GETDATE()) < 3 THEN 1 ELSE 0 END as JoinerFlag, "
			$sql += "	[HIRE_REHIRE_DT] as JoinerDetails, "
			$sql += "	CASE TERMINATION_DT WHEN CONVERT(DateTime, '1900-01-01 00:00:00.000') THEN 0 ELSE CASE WHEN DATEDIFF(month, GETDATE(), [TERMINATION_DT]) < 3 THEN 1 ELSE 0 END END as LeaverFlag, "
			$sql += "	CASE TERMINATION_DT WHEN CONVERT(DateTime, '1900-01-01 00:00:00.000') THEN NULL ELSE TERMINATION_DT END as LeaverDetails, "
			$sql += "	p.[LAST_DATE_WORKED] As LastDateInOffice, "
			$sql += "	'' as Relationships, "
			$sql += "	'' as Suggestions "
			$sql += "From SVC_STAFFLST_VW  s "
			$sql += "INNER JOIN SVC_WW_PER_VW p on p.EXT_EMPLID = s.EXT_EMPLID "
			$sql += "	WHERE [EMPL_STATUS_DESCR] IN ('Active', 'On Leave') AND JOBCODE_DESCR <> 'Pensioner' AND EXT_DEPTID NOT IN ('GBR01_IT024', 'GBR01_FN15') AND OMNIA_ID <> '' "
			$sql += "	AND s.[EXT_EMPLID] IN (" +  $sqlconstraint + ")"
			
            $cmd = New-Object System.Data.SqlClient.SqlCommand $sql, $SqlConnection
            $cmd.Parameters.AddRange($params) | Out-Null
            
            $SqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
            $SqlAdapter.SelectCommand = $cmd
            Write-Host "Getting PS Staff Data..."
            $SqlAdapter.Fill($ds, "Staff") | Out-Null
            
            $output | Add-Member -type NoteProperty -name StaffRecordsRetrieved -value $ds.Tables["Staff"].Rows.Count
            
			# Old Query
            #$sql1 = "SELECT r.[AOX_REL_EMPLID] as EmployeeId"
            #$sql1 += ",r.[AOX_RELATED_NAME] as EmployeeName"
            #$sql1 += ",r.[EXT_EMPLID] as RelatedEmployeeId"
            #$sql1 += ",'$($domainName)\'+ s.OMNIA_ID as RelatedUserName"
            #$sql1 += ",r.[EXT_DISPLAY_NAME] as RelatedName"
            #$sql1 += ",r.[AOX_REL_DESCR] as Relationship"
            #$sql1 += ",s.[PHONE_EXTN] as RelatedPhoneExtension "
            #$sql1 += ", s.[EXT_LOCATION_DESCR] as RelatedOffice "
            #$sql1 += ", CONVERT(nvarchar(25), r.[SYNCDTTM], 126) as ModifiedOn "
            #$sql1 += "FROM [dbo].[SVC_RELATION_VW] r "
            #$sql1 += "INNER JOIN dbo.SVC_STAFFLST_VW s on s.[EXT_EMPLID] = r.[EXT_EMPLID] "
            #$sql1 += "WHERE r.DELETE_ROW = 'N'AND s.OMNIA_ID <> '' AND s.[EMPL_STATUS_DESCR] IN ('Active', 'On Leave') AND r.[AOX_REL_EMPLID] IN (" +  $sqlconstraint + ")"
            #$sql1 += "UNION SELECT '3017167', 'Simon Phillips', '0072716', '$($domainName)\BARRYR', 'Richard Barry', 'Works with', '4072', 'London - Bishops Square'"
            
			# Changed Query
			$sql1 = "SELECT * FROM ( "
			$sql1 += "	SELECT      "
			$sql1 += "		rel.[EXT_EMPLID] as LeftEmployeeId,  "
			$sql1 += "		CASE WHEN rel.AOX_REL_TYPE = 'G' THEN l.FIRST_NAME ELSE rel.[EXT_DISPLAY_NAME] END as LeftEmployeeName,  "
			$sql1 += "		CASE WHEN rel.AOX_REL_TYPE = 'I' THEN '$($domainName)\'+ l.[OMNIA_ID] ELSE NULL END as LeftUserName,  "
			$sql1 += "		CASE WHEN rel.AOX_REL_TYPE = 'I' THEN l.PHONE_EXTN ELSE NULL END as LeftPhoneExt,  "
			$sql1 += "		CASE WHEN rel.AOX_REL_TYPE = 'I' THEN l.EXT_LOCATION_DESCR ELSE NULL END as LeftOffice,  "
			$sql1 += "		rel.AOX_REL_TYPE as RelationshipType,  "
			$sql1 += "		rel.AOX_LOOKUP_TYPE as RelationshipSubType,  "
			$sql1 += "		rel.AOX_REL_DESCR as Relationship,  "
			$sql1 += "		rel.AOX_REL_EMPLID2 as RightId,  "
			$sql1 += "		CASE WHEN rel.AOX_REL_TYPE = 'I' THEN r.FIRST_NAME WHEN rel.AOX_REL_TYPE = 'G' AND rel.AOX_LOOKUP_TYPE = 'L' THEN rel.[CITY] ELSE rel.AOX_LOOKUP_DESCR END  as RightName, "
			$sql1 += "		CONVERT(nvarchar(25), rel.[SYNCDTTM], 126) as ModifiedOn  "
			$sql1 += "	FROM EXT_WW_REL_SHP  rel  "
			$sql1 += "		INNER JOIN dbo.SVC_STAFFLST_VW l on l.[EXT_EMPLID] = rel.[EXT_EMPLID] AND l.OMNIA_ID <> '' "
			$sql1 += "		LEFT JOIN dbo.SVC_STAFFLST_VW r on r.[EXT_EMPLID] = rel.[AOX_REL_EMPLID2] AND r.OMNIA_ID <> '' "
			$sql1 += "	UNION "
			$sql1 += "	SELECT  "
			$sql1 += "		rel.EXT_EMPLID as LeftEmployeeId,  "
			$sql1 += "		rel.EXT_DISPLAY_NAME as LeftEmployeeName,  "
			$sql1 += "		'$($domainName)\'+ l.[OMNIA_ID] as LeftUserName, "
			$sql1 += "		l.PHONE_EXTN as LeftPhoneExt,  "
			$sql1 += "		l.EXT_LOCATION_DESCR as LeftOffice, "
			$sql1 += "		'I' as RelationshipType, "
			$sql1 += "		'E' as RelationshipSubType, "
			$sql1 += "		rel.AOX_REL_DESCR as Relationship,  "
			$sql1 += "		rel.AOX_MEMBER_EMPLID as RightId,  "
			$sql1 += "		r.FIRST_NAME  as RightName,  "
			$sql1 += "		rel.SYNCDTTM as ModifiedOn  "
			$sql1 += "	FROM SVC_WW_GROUP_VW rel "
			$sql1 += "		INNER JOIN dbo.SVC_STAFFLST_VW l on l.[EXT_EMPLID] = rel.[EXT_EMPLID] AND l.OMNIA_ID <> '' "
			$sql1 += "		LEFT JOIN dbo.SVC_STAFFLST_VW r on r.[EXT_EMPLID] = rel.[AOX_MEMBER_EMPLID] AND r.OMNIA_ID <> '' "
			$sql1 += "	) Data " 
			$sql1 += "WHERE RightId IN (" +  $sqlconstraint + ") OR (RelationshipType = 'G' AND LeftEmployeeId IN (" + $sqlconstraint + "))"
			
            $cmd.CommandText = $sql1
            $SqlAdapter.SelectCommand = $cmd
            Write-Host "Getting PS Relationship Data..."
            $SqlAdapter.Fill($ds, "Relationships")  | Out-Null
            $output | Add-Member -type NoteProperty -name RelationshipRecordsRetrieved -value $ds.Tables["Relationships"].Rows.Count
            
            #Write-Verbose "Joining Staff and Relationship Tables"
            #$ds.Relations.Add("EmployeesRelationships", $ds.Tables["Staff"].Columns[0], $ds.Tables["Relationships"].Columns[2], $false) | Out-Null

            $sql2 = "SELECT a.[EXT_EMPLID] as EmployeeId 
                ,s.[EXT_DISPLAY_NAME] as DisplayName 
            ,'$($domainName)\'+ s.OMNIA_ID as UserName 
            ,a.[ABSENCE_TYPE_DESCR] as AbsenceType 
            ,a.[START_DT] as StartDate 
            ,a.[END_DT] as EndDate 
            ,a.[DURATION_DAYS] as DurationDays 
            ,a.[DURATION_HOURS] as DurationHours 
            ,1 as IsAbsence 
            FROM dbo.[SVC_ABSENCE_VW] a 
            INNER JOIN dbo.SVC_STAFFLST_VW s on s.[EXT_EMPLID] = a.[EXT_EMPLID] 
            WHERE  a.[DELETE_ROW] = 'N' 
            AND a.[START_DT] <= convert(varchar(10), getdate(),120) AND (a.[END_DT] >= convert(varchar(10), getdate(),120) OR a.[END_DT] IS NULL) "
            
            if ($PsCmdlet.ParameterSetName -eq "ByUser") {
                $sql2 += "AND s.[OMNIA_ID] IN ($($users)) "
            }
            #$sql2 += "UNION SELECT '3017167', 'Simon Phillips', '$($domainName)\PHILLISI', 'Holiday', '2013-Oct-01', '2013-OCT-31', 20, 0, 1"
          
            $cmd.CommandText = $sql2
            $SqlAdapter.SelectCommand = $cmd
            Write-Host "Getting PS Absence Data..."
            $SqlAdapter.Fill($ds, "CurrentOutofOffice") | Out-Null
            $output | Add-Member -type NoteProperty -name OutOfOfficeRecordsRetrieved -value $ds.Tables["CurrentOutofOffice"].Rows.Count
            
            $sql3 = "SELECT a.[EXT_EMPLID] as EmployeeId "
                $sql3 += ",'$($domainName)\'+ s.OMNIA_ID as UserName "
                $sql3 += ",s.[EXT_DISPLAY_NAME] as DisplayName "
                $sql3 += ",a.[AOX_SEC_COMPANY] as Company "
            $sql3 += ",a.[START_DT] as StartDate "
            $sql3 += ",a.[END_DT] as EndDate "
            $sql3 += ",1 as IsSecondment "
            $sql3 += "FROM dbo.SVC_SECONDMT_VW a "
            $sql3 += "INNER JOIN dbo.SVC_STAFFLST_VW s on s.[EXT_EMPLID] = a.[EXT_EMPLID] "
            $sql3 += "WHERE  s.OMNIA_ID <> '' AND  a.[DELETE_ROW] = 'N' "
            $sql3 += "AND a.[START_DT] <= convert(varchar(10), getdate(),120) AND (a.[END_DT] >= convert(varchar(10), getdate(),120) OR a.[END_DT] IS NULL) "
            if ($PsCmdlet.ParameterSetName -eq "ByUser") {
                $sql3 += "AND s.[OMNIA_ID] IN ($($users))"
            }
            #$sql3 += "UNION SELECT '3017167', '$($domainName)\PHILLISI', 'Simon Phillips', 'Parity', '2013-10-01', '2013-10-31', 1"
          
            $cmd.CommandText = $sql3
            $SqlAdapter.SelectCommand = $cmd
            Write-Host "Getting PS Secondment Data..."
            $SqlAdapter.Fill($ds, "CurrentSecondments") | Out-Null

            $output | Add-Member -type NoteProperty -name SecondmentRecordsRetrieved -value $ds.Tables["CurrentSecondments"].Rows.Count
            
            Write-Verbose "Cleaning up SQL Objects"

            if ($cmd -ne $null) {
                $cmd.Dispose()
            }
            
            if ($SqlConnection -ne $null)
            {
                if ($SqlConnection.State -like "Open") { $SqlConnection.Close() }
                $SqlConnection.Dispose()
            }

            Write-Host "Finished getting data from People Soft."
            #return $ds
            $output | Add-Member -type NoteProperty -name DataSet -value $ds
    
    }
    catch [System.Exception] {
        $output | Add-Member -type NoteProperty -name Error -value $_
    }
    
    Write-Output $output
    Write-Verbose "Leaving PROCESS Method of Get-AOUsersForSyncronisation"
    
}

function Get-AOLastSyncronisationDate
{
<#
.SYNOPSIS
Returns the last date time that the PS Sync took place.
.DESCRIPTION
Looks up a record in the Syncronisation cache database and returns the last date time that the job was run.
.EXAMPLE
Get_PSSyncLastDateTime
.EXAMPLE
Get_PSSyncLastDateTime -syncdb "Data Source=.;Initial Catalog=Unity;Integrated Security=True" 
#>
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$false, Position=1, ValueFromPipeLine=$true, HelpMessage='SQL Client connection string to the SyncDB cache database')]
        [string] $syncdb = "Data Source=.;Initial Catalog=WhosWho;Integrated Security=True;Max Pool Size=10;Min Pool Size=1"
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Get-AOLastSyncronisationDate"
        
        $output = New-Object System.Object
        try {
            $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
            $SqlConnection.ConnectionString = $syncdb
            
            if (-not ($SqlConnection.State -like "Open")) { $SqlConnection.Open() }
        }
        catch [System.Exception] {
            $output | Add-Member -type NoteProperty -name Error -value $_
        }
        
        Write-Verbose "Leaving BEGIN Method of Get-AOLastSyncronisationDate"
    }
    PROCESS {
        Write-Verbose "Entering PROCESS Method of Get-AOLastSyncronisationDate"

        if ($output.Error -eq $null)
        {
            try {
                $cmd = New-Object System.Data.SqlClient.SqlCommand("SELECT TOP 1 [LastProcessData] FROM [dbo].[ProcessInformation]", $SqlConnection)
                $lastdate = $cmd.ExecuteScalar()
                Write-Verbose "Fetched last process date $($lastdate.ToString("yyy-MM-dd HH:mm"))"
                $output | Add-Member -type NoteProperty -name LastDate -value $lastdate.ToString("yyy-MM-dd HH:mm")
                
            }
            catch [System.Exception] {
                $output | Add-Member -type NoteProperty -name Error -value $_
            }
        }
        
        Write-Output $output
        Write-Verbose "Leaving PROCESS Method of Get-AOLastSyncronisationDate"
    }
    END {
        Write-Verbose "Entering END Method of Get-AOLastSyncronisationDate"
        Write-Verbose "Cleaning up SqlClient objects..."
        if ($SqlConnection -ne $null)
        {
            if ($SqlConnection.State -like "Open") { $SqlConnection.Close() }
            $SqlConnection.Dispose()
        }
        Write-Verbose "Leaving END Method of Get-AOLastSyncronisationDate"
    }
}

function Set-AOLastSyncronisationDate
{
<#
.SYNOPSIS
Sets the last date time that the PS Sync took place.
.DESCRIPTION
Writes the current system data time to the Syncronisation cache database.
.EXAMPLE
Set-AOLastSyncronisationDate 
.EXAMPLE
Set-AOLastSyncronisationDate -syncdb "Data Source=.;Initial Catalog=Unity;Integrated Security=True" 
.EXAMPLE
(Get-Date) | Set-AOLastSyncronisationDate
.EXAMPLE
(Get-Date) | Set-AOLastSyncronisationDate -syncdb "Data Source=.;Initial Catalog=Unity;Integrated Security=True"
#>
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$false, Position=0, ValueFromPipeLine=$true, HelpMessage='Date to write to the SyncDB cache database.')]
        [DateTime] $syncDate = (Get-Date),
        [Parameter(Mandatory=$false, Position=1, HelpMessage='SQL Client connection string to the SyncDB cache database.')]
        [string] $syncdb = "Data Source=.;Initial Catalog=WhosWho;Integrated Security=True;Max Pool Size=10;Min Pool Size=1"
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Set-AOLastSyncronisationDate."
        Write-Verbose "Creating SqlClient objects"
        $output = New-Object System.Object
        try {
            $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
            $SqlConnection.ConnectionString = $syncdb
            
            if (-not ($SqlConnection.State -like "Open")) { $SqlConnection.Open() }
        }
        catch [System.Exception] {
            $output | Add-Member -type NoteProperty -name Error -value $_
        }
        Write-Verbose "Leaving BEGIN Method of Set-AOLastSyncronisationDate."
        
    }
    PROCESS {
        Write-Verbose "Entering PROCESS Method of Set-AOLastSyncronisationDate."
        
        if ($output.Error -eq $null)
        {
            $cmd = New-Object System.Data.SqlClient.SqlCommand("UPDATE [dbo].[ProcessInformation] SET [LastProcessData] = @LastProcessData", $SqlConnection)
            $param = New-Object System.Data.SqlClient.SqlParameter("@LastProcessData", [System.Data.SqlDbType]::DateTime)
            $param.Value = $syncDate
            $cmd.Parameters.Add($param) | Out-Null
            
            Write-Verbose "Setting Last Process Date..."
            $rows = $cmd.ExecuteNonQuery()
            
            $output | Add-Member -type NoteProperty -name RowsUpdated -value $rows
        }
        
        Write-Output $output
        
        Write-Verbose "Leaving PROCESS Method of Set-AOLastSyncronisationDate."
        
    }
    END {
        Write-Verbose "Entering END Method of Set-AOLastSyncronisationDate."
        Write-Verbose "Cleaning up SqlClient objects..."
        if ($SqlConnection -ne $null) {
            if ($SqlConnection.State -like "Open") { $SqlConnection.Close() }
            $SqlConnection.Dispose()
        }
        Write-Verbose "Leaving END Method of Set-AOLastSyncronisationDate."
    }
}

function Set-AOUserNotFoundRecord
{
    Param(
        [Parameter(Mandatory=$true)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true)]
        [System.Data.DataRow] $row
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Set-AOUserNotFoundRecord."
        if (-not ($connection.State -like "Open")) { $connection.Open() }
        Write-Verbose "Leaving BEGIN Method of Set-AOUserNotFoundRecord."
    }
    PROCESS {
        Write-Verbose "Entering PROCESS Method of Set-AOUserNotFoundRecord."
        $sqlNF += "IF EXISTS (SELECT [EmployeeId] FROM [dbo].[UsersNotFound] WHERE [EmployeeId] = @EmployeeId) "
                $sqlNF += "UPDATE [dbo].[UsersNotFound] " 
                   $sqlNF += "SET [UserName] = @UserName " 
                      $sqlNF += ",[FirstName] = @FirstName " 
                      $sqlNF += ",[LastName] = @LastName " 
                      $sqlNF += ",[DisplayName] = @DisplayName " 
                      $sqlNF += ",[BusinessTitle] = @BusinessTitle " 
                      $sqlNF += ",[FeeEarnerInitials] = @FeeEarnerInitials " 
                      $sqlNF += ",[Department] = @Department " 
                      $sqlNF += ",[Office] = @Office " 
                      $sqlNF += ",[RoomNumber] = @RoomNumber " 
                      $sqlNF += ",[WorkPhone] = @WorkPhone " 
                      $sqlNF += ",[WorkPhoneExt] = @WorkPhoneExt " 
                      $sqlNF += ",[MobilePhone] = @MobilePhone " 
                      $sqlNF += ",[MobilePhoneQuickDial] = @MobilePhoneQuickDial " 
                      $sqlNF += ",[OfficeShortCut] = @OfficeShortCut " 
                      $sqlNF += ",[JoinerFlag] = @JoinerFlag " 
                      $sqlNF += ",[JoinerDetails] = @JoinerDetails " 
                      $sqlNF += ",[LeaverFlag] = @LeaverFlag " 
                      $sqlNF += ",[LeaverDetails] = @LeaverDetails "
					  $sqlNF += ",[LastDateInOffice] = @LastDateInOffice " 
                      $sqlNF += ",[Relationships] = @Relationships " 
                 $sqlNF += "WHERE [EmployeeId] = @EmployeeId " 
                $sqlNF += "ELSE " 
                $sqlNF += "INSERT INTO [dbo].[UsersNotFound] ([EmployeeId],[UserName],[FirstName],[LastName],[DisplayName],[BusinessTitle],[FeeEarnerInitials],[Department],[Office],[RoomNumber],[WorkPhone],[WorkPhoneExt],[MobilePhone],[MobilePhoneQuickDial],[OfficeShortCut],[JoinerFlag],[JoinerDetails],[LeaverFlag],[LeaverDetails],[LastDateInOffice],[Relationships]) "
                $sqlNF += "VALUES (@EmployeeId,@UserName,@FirstName,@LastName,@DisplayName,@BusinessTitle,@FeeEarnerInitials,@Department,@Office,@RoomNumber,@WorkPhone,@WorkPhoneExt,@MobilePhone,@MobilePhoneQuickDial,@OfficeShortCut,@JoinerFlag,@JoinerDetails,@LeaverFlag,@LeaverDetails,@LastDateInOffice,@Relationships) "
                
                $cmdNF = New-Object System.Data.SqlClient.SqlCommand($sqlNF, $connection)
                
                $param1 = New-Object System.Data.SqlClient.SqlParameter("@EmployeeId", [System.Data.SqlDbType]::NVarChar)
                $param1.Value = $a.EmployeeId
                $param2 = New-Object System.Data.SqlClient.SqlParameter("@UserName", [System.Data.SqlDbType]::NVarChar)
                $param2.Value = $a.UserName
                $param21 = New-Object System.Data.SqlClient.SqlParameter("@FirstName", [System.Data.SqlDbType]::NVarChar)
                $param21.Value = $a.FirstName 
                $param22 = New-Object System.Data.SqlClient.SqlParameter("@LastName", [System.Data.SqlDbType]::NVarChar)
                $param22.Value = $a.LastName 
                $param3 = New-Object System.Data.SqlClient.SqlParameter("@DisplayName", [System.Data.SqlDbType]::NVarChar)
                $param3.Value = $a.DisplayName 
                $param31 = New-Object System.Data.SqlClient.SqlParameter("@BusinessTitle", [System.Data.SqlDbType]::NVarChar)
                $param31.Value = $a.BusinessTitle 
                $param4 = New-Object System.Data.SqlClient.SqlParameter("@Department", [System.Data.SqlDbType]::NVarChar)
                $param4.Value = $a.Department 
                $param16 = New-Object System.Data.SqlClient.SqlParameter("@FeeEarnerInitials", [System.Data.SqlDbType]::NVarChar)
                $param16.Value = $a.FeeEarnerInitials 
                $param5 = New-Object System.Data.SqlClient.SqlParameter("@Office", [System.Data.SqlDbType]::NVarChar)
                $param5.Value = $a.Office 
                $param6 = New-Object System.Data.SqlClient.SqlParameter("@RoomNumber", [System.Data.SqlDbType]::NVarChar)
                $param6.Value = $a.RoomNumber 
                $param7 = New-Object System.Data.SqlClient.SqlParameter("@WorkPhone", [System.Data.SqlDbType]::NVarChar)
                $param7.Value = $a.WorkPhone 
                $param8 = New-Object System.Data.SqlClient.SqlParameter("@WorkPhoneExt", [System.Data.SqlDbType]::NVarChar)
                $param8.Value = $a.WorkPhoneExt 
                $param9 = New-Object System.Data.SqlClient.SqlParameter("@MobilePhone", [System.Data.SqlDbType]::NVarChar)
                $param9.Value = $a.MobilePhone 
                $param10 = New-Object System.Data.SqlClient.SqlParameter("@MobilePhoneQuickDial", [System.Data.SqlDbType]::NVarChar)
                $param10.Value = $a.MobilePhoneQuickDial 
                $param100 = New-Object System.Data.SqlClient.SqlParameter("@OfficeShortCut", [System.Data.SqlDbType]::NVarChar)
                $param100.Value = $a.OfficeShortCut 
                $param11 = New-Object System.Data.SqlClient.SqlParameter("@JoinerFlag", [System.Data.SqlDbType]::Bit)
                $param11.Value = $a.JoinerFlag 
                $param12 = New-Object System.Data.SqlClient.SqlParameter("@JoinerDetails", [System.Data.SqlDbType]::DateTime)
                $param12.Value = $a.JoinerDetails 
                $param13 = New-Object System.Data.SqlClient.SqlParameter("@LeaverFlag", [System.Data.SqlDbType]::Bit)
                $param13.Value = $a.LeaverFlag 
                $param14 = New-Object System.Data.SqlClient.SqlParameter("@LeaverDetails", [System.Data.SqlDbType]::DateTime)
                $param14.Value = $a.LeaverDetails 
				$param17 = New-Object System.Data.SqlClient.SqlParameter("@LastDateInOffice", [System.Data.SqlDbType]::DateTime)
                $param17.Value = $a.LastDateInOffice 
                $param15 = New-Object System.Data.SqlClient.SqlParameter("@Relationships", [System.Data.SqlDbType]::NVarChar)
                $param15.Value = $a.Relationships 
                
                $cmdNF.Parameters.Add($param1) | Out-Null
                $cmdNF.Parameters.Add($param2) | Out-Null
                $cmdNF.Parameters.Add($param21) | Out-Null
                $cmdNF.Parameters.Add($param22) | Out-Null
                $cmdNF.Parameters.Add($param3) | Out-Null
                $cmdNF.Parameters.Add($param31) | Out-Null
                $cmdNF.Parameters.Add($param4) | Out-Null
                $cmdNF.Parameters.Add($param16) | Out-Null
                $cmdNF.Parameters.Add($param5) | Out-Null
                $cmdNF.Parameters.Add($param6) | Out-Null
                $cmdNF.Parameters.Add($param7) | Out-Null
                $cmdNF.Parameters.Add($param8) | Out-Null
                $cmdNF.Parameters.Add($param9) | Out-Null
                $cmdNF.Parameters.Add($param10) | Out-Null
                $cmdNF.Parameters.Add($param100) | Out-Null
                $cmdNF.Parameters.Add($param11) | Out-Null
                $cmdNF.Parameters.Add($param12) | Out-Null
                $cmdNF.Parameters.Add($param13) | Out-Null
                $cmdNF.Parameters.Add($param14) | Out-Null
				$cmdNF.Parameters.Add($param17) | Out-Null
                $cmdNF.Parameters.Add($param15) | Out-Null
                
                $cmdNF.ExecuteNonQuery() | Out-Null
                Write-Verbose "Leaving PROCESS Method of Set-AOUserNotFoundRecord."
    }
    END {}
}

function Remove-AOTimeRecord
{
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true, Position=2)]
        [System.Data.DataRow] $row
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Remove-AOTimeRecord."
        if (-not ($connection.State -like "Open")) { $connection.Open() }
        Write-Verbose "Leaving BEGIN Method of Remove-AOTimeRecord."
    }
    PROCESS {
        Write-Verbose "Entering Process Method of Remove-AOTimeRecord."
        $sql = "DELETE FROM [dbo].[CurrentTimeRecords] WHERE Id = @Id"
        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
        $param1 = New-Object System.Data.SqlClient.SqlParameter("@Id", [System.Data.SqlDbType]::Int)
        $param1.Value = $row.Id
        $cmd.Parameters.Add($param1) | Out-Null
        $cmd.ExecuteNonQuery() | Out-Null
        $cmd.Dispose()
        Write-Verbose "Leaving Process Method of Remove-AOTimeRecord."
    }
    END {}
}

function Connect-WebService
{
##
## Connect to a given web service, and create a type that allows you to
## interact with that web service.
##
## Example:
##
##     $wsdl = “http://terraserver.microsoft.com/TerraService2.asmx?WSDL”
##     $terraServer = Connect-WebService $wsdl
##     $place = New-Object Place
##     $place.City = “Redmond”
##     $place.State = “WA”
##     $place.Country = “USA”
##     $facts = $terraserver.GetPlaceFacts($place)
##     $facts.Center
##############################################################################
    param(
        [string] $wsdlLocation = $(throw “Please specify a WSDL location”),
        [string] $namespace,
        [Switch] $requiresAuthentication
    )

    ## Create the web service cache, if it doesn’t already exist
    if(-not (Test-Path Variable:\AO.Intranet.WebServiceCache))
    {
        ${GLOBAL:AO.Intranet.WebServiceCache} = @{}
    }

    ## Check if there was an instance from a previous connection to this web service. If so, return that instead.

    $oldInstance = ${GLOBAL:AO.Intranet.WebServiceCache}[$wsdlLocation]
    if($oldInstance) {
        $oldInstance
        return
    }

    ## Load the required Web Services DLL
    [void] [Reflection.Assembly]::LoadWithPartialName(“System.Web.Services”)
    ## Download the WSDL for the service, and create a service description from it.

    $wc = new-object System.Net.WebClient

    if($requiresAuthentication) {
        $wc.UseDefaultCredentials = $true
    }

    $wsdlStream = $wc.OpenRead($wsdlLocation)

    ## Ensure that we were able to fetch the WSDL
    if(-not (Test-Path Variable:\wsdlStream)) {
        return
    }

    $serviceDescription = [Web.Services.Description.ServiceDescription]::Read($wsdlStream)
    $wsdlStream.Close()

    ## Ensure that we were able to read the WSDL into a service description

    if(-not (Test-Path Variable:\serviceDescription)) {
        return
    }

    ## Import the web service into a CodeDom
    $serviceNamespace = New-Object System.CodeDom.CodeNamespace
    if($namespace) {
        $serviceNamespace.Name = $namespace
    }

    $codeCompileUnit = New-Object System.CodeDom.CodeCompileUnit
    $serviceDescriptionImporter =  New-Object Web.Services.Description.ServiceDescriptionImporter

    $serviceDescriptionImporter.AddServiceDescription($serviceDescription, $null, $null)
    [void] $codeCompileUnit.Namespaces.Add($serviceNamespace)
    [void] $serviceDescriptionImporter.Import($serviceNamespace, $codeCompileUnit)

    ## Generate the code from that CodeDom into a string
    $generatedCode = New-Object Text.StringBuilder
    $stringWriter = New-Object IO.StringWriter $generatedCode
    $provider = New-Object Microsoft.CSharp.CSharpCodeProvider 
    $provider.GenerateCodeFromCompileUnit($codeCompileUnit, $stringWriter, $null)

    ## Compile the source code.
    $references = @("System.dll", "System.Web.Services.dll", "System.Xml.dll")
    $compilerParameters = New-Object System.CodeDom.Compiler.CompilerParameters 
    $compilerParameters.ReferencedAssemblies.AddRange($references)
    $compilerParameters.GenerateInMemory = $true

    $compilerResults = $provider.CompileAssemblyFromSource($compilerParameters, $generatedCode)
    ## Write any errors if generated.         

    if($compilerResults.Errors.Count -gt 0) { 
        $errorLines = "" 
        foreach($error in $compilerResults.Errors) { 
            $errorLines += "`n`t" + $error.Line + ":`t" + $error.ErrorText 
        } 
        Write-Error $errorLines
        return 
    } else {
        ## There were no errors.  Create the webservice object and return it.
        ## Get the assembly that we just compiled 
        $assembly = $compilerResults.CompiledAssembly

        ## Find the type that had the WebServiceBindingAttribute. 
        ## There may be other “helper types” in this file, but they will not have this attribute

        $type = $assembly.GetTypes() |
            Where-Object { $_.GetCustomAttributes([System.Web.Services.WebServiceBindingAttribute], $false) }

        if(-not $type) {
            Write-Error "Could not generate web service proxy."
            return
        }


        ## Create an instance of the type, store it in the cache, and return it to the user.
        $instance = $assembly.CreateInstance($type)
        ${GLOBAL:AO.Intranet.WebServiceCache}[$wsdlLocation] = $instance
        $instance
    }
}

function Set-UserJoinerLeaver
{
 [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true, Position=2)]
        [System.Data.DataRow] $row,
        [Parameter(Mandatory=$true, Position=3)]
        [System.Boolean] $current
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Set-UserJoinerLeaver."
        if (-not ($connection.State -like "Open")) { $connection.Open() }
        Write-Verbose "Leaving BEGIN Method of Set-UserJoinerLeaver."
    }
    PROCESS {
        Write-Verbose "Entering Process Method of Set-UserJoinerLeaver."
        
        $sql = "IF EXISTS (SELECT Id FROM [dbo].[JoinerLeavers] WHERE [UserName] = @UserName)"
        $sql += "	UPDATE [dbo].[JoinerLeavers] SET [JoinerDetails] = @JoinerDetails, [LeaverDetails] = @LeaverDetails, [LastDateInOffice] = @LastDateInOffice, [WhosWhoFlag] = @WhosWhoFlag WHERE [UserName] = @UserName "
        $sql += "ELSE"
        $sql += "	INSERT INTO [dbo].[JoinerLeavers] ([UserName], [JoinerDetails], [LeaverDetails], [LastDateInOffice], [WhosWhoFlag]) VALUES (@UserName, @JoinerDetails, @LeaverDetails, @LastDateInOffice, @WhosWhoFlag) "
        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
        
        $param1 = New-Object System.Data.SqlClient.SqlParameter("@UserName", [System.Data.SqlDbType]::NVarChar)
        $param1.Value = $row.UserName
        $param3 = New-Object System.Data.SqlClient.SqlParameter("@JoinerDetails", [System.Data.SqlDbType]::DateTime)
        $param3.Value = $row.JoinerDetails
        $param4 = New-Object System.Data.SqlClient.SqlParameter("@LeaverDetails", [System.Data.SqlDbType]::DateTime)
        $param4.Value = $row.LeaverDetails
		$param5 = New-Object System.Data.SqlClient.SqlParameter("@LastDateInOffice", [System.Data.SqlDbType]::DateTime)
        $param5.Value = $row.LastDateInOffice
        $param6 = New-Object System.Data.SqlClient.SqlParameter("@WhosWhoFlag", [System.Data.SqlDbType]::Bit)
        $param6.Value = $current

        $cmd.Parameters.Add($param1) | Out-Null
        $cmd.Parameters.Add($param3) | Out-Null
        $cmd.Parameters.Add($param4) | Out-Null
        $cmd.Parameters.Add($param5) | Out-Null
		$cmd.Parameters.Add($param6) | Out-Null
        
        $cmd.ExecuteNonQuery() | Out-Null
        $cmd.Dispose()
        
        Write-Verbose "Leaving Process Method of Set-UserJoinerLeaver."
    }
    END {
        
    }
}

function Set-AOTimeRecord
{
  [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true, Position=2)]
        [string] $type,
        [Parameter(Mandatory=$true, Position=3)]
        [System.Data.DataRow] $row
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Set-AOTimeRecord."
        if (-not ($connection.State -like "Open")) { $connection.Open() }
        Write-Verbose "Leaving BEGIN Method of Set-AOTimeRecord."
    }
    PROCESS {
        Write-Verbose "Entering Process Method of Set-AOTimeRecord."
        $sql = "IF EXISTS (SELECT Id FROM [dbo].[CurrentTimeRecords] WHERE [Type] = @Type AND [UserName] = @UserName)"
        $sql += "   UPDATE [dbo].[CurrentTimeRecords] SET [StartDate] = @StartDate ,[EndDate] = @EndDate WHERE  [Type] = @Type AND [UserName] = @UserName "
        $sql += "ELSE"
        $sql += "   INSERT INTO [dbo].[CurrentTimeRecords] ([Type] ,[UserName] ,[StartDate] ,[EndDate]) VALUES (@Type, @UserName, @StartDate, @EndDate) "
        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
        
        $param1 = New-Object System.Data.SqlClient.SqlParameter("@UserName", [System.Data.SqlDbType]::NVarChar)
        $param1.Value = $row.UserName
        $param2 = New-Object System.Data.SqlClient.SqlParameter("@Type", [System.Data.SqlDbType]::NVarChar)
        $param2.Value = $type
        $param3 = New-Object System.Data.SqlClient.SqlParameter("@StartDate", [System.Data.SqlDbType]::DateTime)
        $param3.Value = $row.StartDate
        $param4 = New-Object System.Data.SqlClient.SqlParameter("@EndDate", [System.Data.SqlDbType]::DateTime)
        $param4.Value = $row.EndDate

        $cmd.Parameters.Add($param1) | Out-Null
        $cmd.Parameters.Add($param2) | Out-Null
        $cmd.Parameters.Add($param3) | Out-Null
        $cmd.Parameters.Add($param4) | Out-Null
        
        $cmd.ExecuteNonQuery() | Out-Null
        $cmd.Dispose()
        
        Write-Verbose "Leaving Process Method of Set-AOTimeRecord."
    }
    END {}
}

function Set-CV
{
  [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$false, Position=1)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true, Position=2, ValueFromPipeLine=$true)]
        [System.Data.DataRow] $row
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Set-CV."
        [String]$sql = "UPDATE CachedData SET [CV] = @CV WHERE UserName = @UserName IF @@ROWCOUNT=0 INSERT INTO [CachedData] ([UserName],[CV]) VALUES (@UserName, @CV)"
        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
        
        $param1 = New-Object System.Data.SqlClient.SqlParameter("@UserName", [System.Data.SqlDbType]::NVarChar)
        $param2 = New-Object System.Data.SqlClient.SqlParameter("@CV", [System.Data.SqlDbType]::NVarChar)
        
        $cmd.Parameters.Add($param1) | Out-Null
        $cmd.Parameters.Add($param2) | Out-Null
        Write-Verbose "Leaving BEGIN Method of Set-CV."
        
    }
    PROCESS {
        Write-Verbose "Entering PROCESS Method of Set-CV."
        $cmd.Parameters["@UserName"].Value = $row.UserName
        $cmd.Parameters["@CV"].Value = $row.CVHtml
        $cmd.ExecuteNonQuery() | Out-Null
        Write-Verbose "Leaving PROCESS Method of Set-CV."
    }
    END {
        Write-Verbose "Entering END Method of Set-CV."
        $cmd.Dispose()
        Write-Verbose "Leaving END Method of Set-CV."
    }
}

function Set-Relationships
{
  [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$false, Position=1)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true, Position=2, ValueFromPipeLine=$true)]
        [System.Data.DataRow] $row
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Set-Relationships."
        [String]$sql = "UPDATE CachedData SET [Relationships] = @Relationships WHERE UserName = @UserName IF @@ROWCOUNT=0 INSERT INTO [CachedData] ([UserName],[Relationships]) VALUES (@UserName, @Relationships)"
        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
        
        $param1 = New-Object System.Data.SqlClient.SqlParameter("@UserName", [System.Data.SqlDbType]::NVarChar)
        $param2 = New-Object System.Data.SqlClient.SqlParameter("@Relationships", [System.Data.SqlDbType]::NVarChar)
        
        $cmd.Parameters.Add($param1) | Out-Null
        $cmd.Parameters.Add($param2) | Out-Null
        Write-Verbose "Leaving BEGIN Method of Set-Relationships."
        
    }
    PROCESS {
        Write-Verbose "Entering PROCESS Method of Set-Relationships."
        $cmd.Parameters["@UserName"].Value = $row.UserName
        $cmd.Parameters["@Relationships"].Value = $row.Relationships
        $cmd.ExecuteNonQuery() | Out-Null
        Write-Verbose "Leaving PROCESS Method of Set-Relationships."
    }
    END {
        Write-Verbose "Entering END Method of Set-Relationships."
        $cmd.Dispose()
        Write-Verbose "Leaving END Method of Set-Relationships."
    }
}


function Set-Suggestions
{
  [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$false, Position=1)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true, Position=2, ValueFromPipeLine=$true)]
        [System.Data.DataRow] $row
    )
    
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Set-Suggestions."
        [String]$sql = "UPDATE CachedData SET [Suggestions] = @Suggestions, [SuggestionsUpdated] = GetDate() WHERE UserName = @UserName IF @@ROWCOUNT=0 INSERT INTO [CachedData] ([UserName],[Suggestions], [SuggestionsUpdated] ) VALUES (@UserName, @Suggestions, GetDate())"
        $cmd = New-Object System.Data.SqlClient.SqlCommand($sql, $connection)
        
        $param1 = New-Object System.Data.SqlClient.SqlParameter("@UserName", [System.Data.SqlDbType]::NVarChar)
        $param2 = New-Object System.Data.SqlClient.SqlParameter("@Suggestions", [System.Data.SqlDbType]::NVarChar)
        
        $cmd.Parameters.Add($param1) | Out-Null
        $cmd.Parameters.Add($param2) | Out-Null
        Write-Verbose "Leaving BEGIN Method of Set-Suggestions."
        
    }
    PROCESS {
        Write-Verbose "Entering PROCESS Method of Set-Suggestions."
        $cmd.Parameters["@UserName"].Value = $row.UserName
        $cmd.Parameters["@Suggestions"].Value = $row.Suggestions
        $cmd.ExecuteNonQuery() | Out-Null
        Write-Verbose "Leaving PROCESS Method of Set-Suggestions."
    }
    END {
        Write-Verbose "Entering END Method of Set-Suggestions."
        $cmd.Dispose()
        Write-Verbose "Leaving END Method of Set-Suggestions."
    }
}

function Set-AOProfile
{
   [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1)]
        [Microsoft.Office.Server.UserProfiles.UserProfileManager] $upspm,
        [Parameter(Mandatory=$false, Position=2)]
        [System.Data.SqlClient.SqlConnection] $connection,
        [Parameter(Mandatory=$true, Position=3)]
        [System.Data.DataRow] $row,
        [Parameter(Mandatory=$false, Position=4, HelpMessage='If flag is set then no record will be written to the Users Not Found Table')]
        [switch] $nowrite
    )
    
    BEGIN {
        $today = Get-Date
    }
    PROCESS {
        Write-Verbose "Entering Process Method of Set-AOProfile."
        
        Write-Verbose "Processing $($a.DisplayName)"
        
        $fieldsUpdated = $false
        if ($upspm.UserExists($row.UserName)) 
        {
            #Get user profile and change the value
            $up = $upspm.GetUserProfile($row.UserName)
            if ($row.WhosWhoFlag -ne $null) {
                Write-Host "$($row.UserName)"
                Write-Verbose "Updating Whos Who Flag for $($a.DisplayName)"
                
                if ($up["ao.whosWhoFlag"].Value -ne $row.WhosWhoFlag)
                {
                    Write-Verbose "$($row.UserName) - WhosWhoFlag = '$($row.WhosWhoFlag)'"
                    $up["ao.whosWhoFlag"].Value = $row.WhosWhoFlag
                    $fieldsUpdated = $true
                }
                
                Set-UserJoinerLeaver -connection $connection -row $row -current $row.WhosWhoFlag
                
            
            } elseif ($row.CVHtml -ne $null) {
            
                Write-Host "$($row.UserName)"
            
                if ($row.CVHtml.Length > 3000)
                {
                    Write-Verbose "Large HTML"
                }
            
                Write-Verbose "Setting CV Data for $($a.DisplayName)"
                Write-Verbose "$($row.UserName) - ao.cvsandexperience = '$($row.CVHtml)'"
                $up["ao.cvsandexperience"].Value = $row.CVHtml
                $fieldsUpdated = $true
            } elseif ($row.IsTimeRemoval -ne $null) {
                Write-Verbose "Removing $($a.Type) for $($a.DisplayName)"
                if ($row.Type -eq "Absence") {
                    Write-Verbose "$($row.UserName) - ao.outOfOfficeDetail = ''" 
                    $up["ao.outOfOfficeDetail"].Value = ""
                    $up["ao.outOfOfficeFlag"].Value = $false
                    $fieldsUpdated = $true
                    Remove-AOTimeRecord -connection $connection -row $row
                } elseif ($row.Type -eq "Secondment") {
                    Write-Verbose "$($row.UserName) - ao.secondmentDetail = ''"
                    $up["ao.secondmentDetail"].Value = ""
                    $up["ao.secondmentFlag"].Value = $false
                    $fieldsUpdated = $true
                    Remove-AOTimeRecord -connection $connection -row $row
                }
            } elseif ($row.IsSecondment -ne $null) {
                Write-Verbose "Setting Secondment details for $($a.DisplayName)"
                $secondment = "$($row.Company) from $($row.StartDate.ToString("dd/MM/yyyy"))"
                if ($row.EndDate -ne [System.DBNull]::Value) {
                    $secondment += " to $($row.EndDate.ToString("dd/MM/yyyy"))"
                }
            
                Write-Verbose "$($row.UserName) - ao.secondmentDetail = '$($secondment)'"
                $up["ao.secondmentDetail"].Value = $secondment
                $up["ao.secondmentFlag"].Value = $true
                
                # Write Secondment Record in Cache
                Set-AOTimeRecord -connection $connection -type "Secondment" -row $row
                
                $fieldsUpdated = $true
            } elseif ($row.IsAbsence -ne $null) {
                Write-Verbose "Setting Absence details for $($a.DisplayName)"
                $absence = "from $($row.StartDate.ToString("dd/MM/yyyy"))"
                if ($row.EndDate -ne [System.DBNull]::Value) {
                    $absence += " to $($row.EndDate.ToString("dd/MM/yyyy"))"
                }
            
                Write-Verbose "$($row.UserName) - ao.outOfOfficeDetail = '$($absence)'"
                $up["ao.outOfOfficeDetail"].Value = $absence
                $up["ao.outOfOfficeFlag"].Value = $true
                
                # Write Absent Record in Cache
                Set-AOTimeRecord -connection $connection -type "Absence" -row $row
                $fieldsUpdated = $true
            } else {
                Write-Verbose "Updating User Profile for $($a.DisplayName)"
                if ($row.EmployeeId -ne $null) {
                    Write-Verbose "$($row.UserName) - ao.employeeId = '$($row.EmployeeId)'"
                    $up["ao.employeeId"].Value = $row.EmployeeId
                    $fieldsUpdated = $true
                } 
                
                # Add Job title HERE
                if ($row.BusinessTitle -ne $null) {
                    Write-Verbose "$($row.UserName) - ao.businessTitle = '$($row.BusinessTitle)'"
                    $up["ao.businessTitle"].Value = $row.BusinessTitle
                    $fieldsUpdated = $true
                }
                
                if ($row.FeeEarnerInitials -ne $null) {
                    Write-Verbose "$($row.UserName) - ao.FeeEarnerInitials = '$($row.FeeEarnerInitials)'"
                    $up["ao.FeeEarnerInitials"].Value = $row.FeeEarnerInitials
                    $fieldsUpdated = $true
                }
                
                if ($row.WorkPhoneExt -ne $null) {
                    $wpe = ""
                    if ($row.OfficeShortCut -ne $null -and $row.OfficeShortCut -ne "" -and $row.WorkPhoneExt -ne "")
                    {
                        # Add Office Shortcut code to Ext.
                        $wpe = "($($row.OfficeShortCut)) $($row.WorkPhoneExt)"
                    } else {
                        $wpe =$row.WorkPhoneExt
                    }
                    Write-Verbose "$($row.UserName) - ao.WorkExtension = '$($wpe)'"
                    $up["ao.WorkExtension"].Value = $wpe
                    $fieldsUpdated = $true
                } 
                
                # Added 19-Dec-2013
                if ($row.Department -ne $null) {
                    Write-Verbose "$($row.UserName) - ao.DepartmentDescription = '$($row.Department)'"
                    $up["ao.DepartmentDescription"].Value = $row.Department
                    $fieldsUpdated = $true
                }
                
                <#
                # Done via UPS Sync from AD
                if ($row.RoomNumber -ne $null) {
                    Write-Verbose "$($row.UserName) - ao.RoomNumber = '$($row.RoomNumber)'"
                    $up["ao.RoomNumber"].Value = $row.RoomNumber
                    $fieldsUpdated = $true
                }
                #>
                
                if ($row.MobilePhone -ne $null) {
                    Write-Verbose "$($row.UserName) - CellPhone = '$($row.MobilePhone)'"
                    $up["CellPhone"].Value = $row.MobilePhone
                    $fieldsUpdated = $true
                } 

                if ($row.MobilePhoneQuickDial -ne $null) {
                    $msc = ""
                    if ($row.MobilePhone -ne $null -and $row.MobilePhone -ne "") {
                        $msc = $row.MobilePhoneQuickDial
                    }

                    Write-Verbose "$($row.UserName) - ao.workMobileQuickDial = '$($msc)'"
                    $up["ao.workMobileQuickDial"].Value = $msc
                    $fieldsUpdated = $true
                }


                $current = $false
				Write-Verbose "$($row.UserName) - Checking JoinerDetails"
                if ($row.JoinerDetails -ne $null) {
                    if ($row.JoinerDetails -le $today)
                    {
                        $current = $true
                    }
                }

				Write-Verbose "$($row.UserName) - Checking LeaversDetails"
                if ($row.LeaversDetails -ne $null) {
                    if ($row.JoinerDetails -le $today)
                    {
                        $current = $false
                    }
                }

				#Check Last Date in Office Field
				Write-Verbose "$($row.UserName) - Checking LastDateInOffice '$($row.LastDateInOffice -ne [DBNull]::Value)'"
				if ($row.LastDateInOffice -ne [DBNull]::Value) {
                    if ($row.LastDateInOffice -le $today)
                    {
                        $current = $false
                    }
                }
                
				Write-Verbose "$($row.UserName) - Who's Who Calculation = '$($current)'"
                
                if ($up["ao.whosWhoFlag"].Value -ne $current)
                {
                    Write-Verbose "$($row.UserName) - WhosWhoFlag = '$($current)'"
                    $up["ao.whosWhoFlag"].Value = $current
                    $fieldsUpdated = $true
                }
                
                Set-UserJoinerLeaver -connection $connection -row $row -current $current
            }
            
            if ($fieldsUpdated -eq $true) {
                Write-Verbose "Committing profile data for $($row.DisplayName)"
                $up.Commit()
                Write-Verbose "Updated $($row.DisplayName)"
            } else {
                Write-Verbose "No fields Updated for $($row.DisplayName)"
            }
        }
        else
        {
            Write-Verbose "$($row.UserName) - UPS Profile User Not Found!"
            if (-not $nowrite) {
                Set-AOUserNotFoundRecord -connection $connection -row $row # Write entry to User Not Found
            }
        }
        Write-Verbose "========================================================="
        Write-Verbose "Leaving Process Method of Set-AOProfile."
    }
    END {}
}

function Import-CVData
{
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1, ValueFromPipeLine=$true, HelpMessage='System.Data.DataSet object containing the data which will be used to import into the UPS profiles')]
        [System.Data.DataSet] $data,
        [Parameter(Mandatory=$false, Position=2, HelpMessage='Url of the SharePoint Site')]
        [string] $url = "http://intranet.allenovery.com",
        [Parameter(Mandatory=$false, Position=3, HelpMessage='SQL Client connection string to the SyncDB cache database')]
        [string] $syncdb = "Data Source=.;Initial Catalog=WhosWho;Integrated Security=True;Max Pool Size=10;Min Pool Size=1"
    )
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Import-CVData."
    
        $output = New-Object System.Object
        $output | Add-Member -type NoteProperty -name ProcessDate -value (Get-Date)
        
    
        # Load SharePoint Snapin
        Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
        $snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
        if ($snapin -eq $null) {
            Add-PSSnapin "Microsoft.SharePoint.Powershell"
        }
        Write-Host -ForeGroundColor Green " (done)"
        
        #Get site objects and connect to User Profile Manager service
        Write-Host "Getting UPS..." -nonewline
        $site = Get-SPSite $url
        $context = Get-SPServiceContext $site
        $profileManager = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($context) 
        Write-Host -ForeGroundColor Green " (done)"
        
        $wsdl = "http://cmc-services/AO.Esb.crm/CVService.svc?wsdl"
        $CVService = Connect-WebService $wsdl
        
        $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
        $SqlConnection.ConnectionString = $syncdb
        if (-not ($SqlConnection.State -like "Open")) { $SqlConnection.Open() }
        
        Write-Verbose "Leaving BEGIN Method of Import-CVData."
    }
    PROCESS {
        # Check the DateSetName
        if ($data.DataSetName -ne "CVData") {
            $message = "Unknown Dataset passed."
            $exception = New-Object InvalidOperationException $message
            $errorID = 'UnknownDataSet'
            $errorCategory = [Management.Automation.ErrorCategory]::InvalidOperation
            $target = $Path
            $errorRecord = New-Object Management.Automation.ErrorRecord $exception, $errorID, $errorCategory, $target
            $PSCmdlet.ThrowTerminatingError($errorRecord)
        }
        
        $count = $data.Tables["Staff"].Rows.Count
        $counter = 0
        Write-Verbose "Writing $($count) record(s) to UPS..."
        $output | Add-Member -type NoteProperty -name CVsToLoad -value $count
        foreach($a in $data.Tables["Staff"]) {
            $counter++ | Out-Null 
            $pc = ($counter / $count)
            Write-Progress -activity "Getting CV Data" -Status $("{0:P} Complete" -f $pc) -PercentComplete $($pc * 100)
            
            $cvs = $CVService.GetCVsByEmployee($a.EmployeeId)
    
            $cvHTML = ""
            $cvs | foreach {
                $cvHTML += "<tr><td width=""60%""><a href=""$($_.Uri)"">$($_.Title)</a></td><td width=""40%"" class=""telephone"">$($_.Language)</td></tr>"
            }
            if ($cvHTML.Length -gt 0) {
                $cvHTML = "<table width=""100%"" class=""whosWho"" border=""0"" cellspacing=""5"" cellpadding=""0""><tbody>$($cvHTML)</tbody></table>"
            }
            
            $a.CVHtml = $cvHTML
                    
            
            #Set-AOProfile -upspm $profileManager -connection $null -row $a -nowrite
        }
        
        Write-Progress -activity "Getting CV Data" -Completed -Status "Done"
        
        Write-Verbose "Writing records to the database..."
        
        $data.Tables["Staff"] | Set-CV -connection $SqlConnection
        
        Write-Verbose "Finished writing records"
    }
    END {
        Write-Verbose "Entering END Method of Import-CVData."

        Write-Verbose "Cleaning up SP Objects"
        $site.Dispose()
        
        Write-Verbose "Cleaning up SqlClient Objects"
        if ($SqlConnection -ne $null) {
            if ($SqlConnection.State -like "Open") { $SqlConnection.Close() }
            $SqlConnection.Dispose()
        }
        
        Write-Verbose "Leaving END Method of Import-CVData."
    }
}

function Import-AOSyncronisationData
{
<#
.SYNOPSIS
Updates specific UPS fields
.DESCRIPTION
Certain fields can not be easily updated through the UPS sync this function takes a known dataset and uses the information to update A&O's UPS Profiles
.EXAMPLE
Import-AOSyncronisationData -data $ds
.EXAMPLE
$ds | Import-AOSyncronisationData 
.EXAMPLE
$ds | Import-AOSyncronisationData -url "http://intranet.allenovery.com"
.EXAMPLE
$ds | Import-AOSyncronisationData -url "http://intranet.allenovery.com" -syncdb "Data Source=.;Initial Catalog=WhosWho;Integrated Security=True;Max Pool Size=10;Min Pool Size=1"
#>
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1, ValueFromPipeLine=$true, HelpMessage='System.Data.DataSet object containing the data which will be used to import into the UPS profiles')]
        [System.Data.DataSet] $data,
        [Parameter(Mandatory=$false, Position=2, HelpMessage='Url of the SharePoint Site')]
        [string] $url = "http://intranet.allenovery.com",
        [Parameter(Mandatory=$false, Position=3, HelpMessage='SQL Client connection string to the SyncDB cache database')]
        [string] $syncdb = "Data Source=.;Initial Catalog=WhosWho;Integrated Security=True;Max Pool Size=10;Min Pool Size=1"
    )
    BEGIN {
        Write-Verbose "Entering BEGIN Method of Import-AOSyncronisationData."
    
        $output = New-Object System.Object
        $output | Add-Member -type NoteProperty -name ProcessDate -value (Get-Date)
        
        try {
            # Load SharePoint Snapin
            Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
            $snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
            if ($snapin -eq $null) {
                Add-PSSnapin "Microsoft.SharePoint.Powershell"
            }
            Write-Host -ForeGroundColor Green " (done)"
            
            #Get site objects and connect to User Profile Manager service
            Write-Host "Getting UPS..." -nonewline
            $site = Get-SPSite $url
            $context = Get-SPServiceContext $site
            $profileManager = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($context) 
            Write-Host -ForeGroundColor Green " (done)"
            
            $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
            $SqlConnection.ConnectionString = $syncdb
            if (-not ($SqlConnection.State -like "Open")) { $SqlConnection.Open() }

        }
        catch [System.Exception] {
            $output | Add-Member -type NoteProperty -name Error -value $_
        }
        
        Write-Verbose "Leaving BEGIN Method of Import-AOSyncronisationData."
    }
    PROCESS {
    
        Write-Verbose "Entering ProcessRecord Method of Import-AOSyncronisationData."
        
        if ($output.Error -ne $null)
        {
            Write-Output $output
            return
        }
        
        try {
            # Check the DateSetName
            if ($data.DataSetName -ne "ExtendedUPSData") {
                $message = "Unknown Dataset passed."
                $exception = New-Object InvalidOperationException $message
                $errorID = 'UnknownDataSet'
                $errorCategory = [Management.Automation.ErrorCategory]::InvalidOperation
                $target = $Path
                $errorRecord = New-Object Management.Automation.ErrorRecord $exception, $errorID, $errorCategory, $target
                $PSCmdlet.ThrowTerminatingError($errorRecord)
            }
            
            $SqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
            
            # Get Office Shortcut codes
            Write-Verbose "Getting Office Shortcut codes..."
            $cmdOffices = New-Object System.Data.SqlClient.SqlCommand "SELECT [Office], [OfficeDialShortCut] FROM [dbo].[OfficeExtendedData] ORDER BY [Office]", $SqlConnection
            $SqlAdapter.SelectCommand = $cmdOffices
            $SqlAdapter.Fill($data, "OfficeExtendedData") | Out-Null
            $cmdOffices.Dispose()
            Write-Verbose "Finished getting Office Shortcut Codes"
            
            Write-Verbose "Getting Relationship Weightings..."
            $cmdWeightings = New-Object System.Data.SqlClient.SqlCommand "SELECT * FROM [dbo].[RelationshipWeightings]", $SqlConnection
            $SqlAdapter.SelectCommand = $cmdWeightings
            $SqlAdapter.Fill($data, "Weightings") | Out-Null
            $cmdWeightings.Dispose()
            Write-Verbose "Finished getting Relationship Weightings..."
            
            # Clear Absence and Secondment
            Write-Verbose "Getting Out of date Time Records..."
            $cmdTimeRecords = New-Object System.Data.SqlClient.SqlCommand "SELECT [Id], [Type], [UserName], [StartDate], [EndDate], 1 as IsTimeRemoval FROM [dbo].[CurrentTimeRecords] WHERE EndDate < GETDATE()", $SqlConnection
            $SqlAdapter.SelectCommand = $cmdTimeRecords
            $SqlAdapter.Fill($data, "OutofDate") | Out-Null
            $cmdTimeRecords.Dispose()
            Write-Verbose "Finished getting Out of Date Time records"

            # Changes to the WhosWhoFlag
            Write-Verbose "Getting Out of date Whos Who Flag Data..."

			# Changed to include Last Date In Office
            $cmdWhosWhoRecords = New-Object System.Data.SqlClient.SqlCommand "SELECT UserName, JoinerDetails, LeaverDetails, LastDateInOffice, 1 as [WhosWhoFlag] From [JoinerLeavers] WHERE JoinerDetails <= GETDATE() AND WhosWhoFlag = 0 AND (LeaverDetails IS NULL OR LeaverDetails >= GETDATE()) AND (LastDateInOffice IS NULL OR LastDateInOffice >= GETDATE()) UNION SELECT UserName, JoinerDetails, LeaverDetails, LastDateInOffice, 0 as [WhosWhoFlag] From [JoinerLeavers] WHERE LeaverDetails <= GETDATE() AND WhosWhoFlag = 1	OR LastDateInOffice < GETDATE()", $SqlConnection
            $SqlAdapter.SelectCommand = $cmdWhosWhoRecords
            $SqlAdapter.Fill($data, "WhosWhoFlagChanges") | Out-Null
            $cmdTimeRecords.Dispose()
            Write-Verbose "Finished getting Out of Whos Who Flag Data"

            Write-Verbose "Getting Users not Found..."
            $cmdOldNf = New-Object System.Data.SqlClient.SqlCommand "SELECT * FROM [dbo].[UsersNotFound]", $SqlConnection
            $SqlAdapter.SelectCommand = $cmdOldNf
            $SqlAdapter.Fill($data, "UsersNotFound") | Out-Null
            $cmdOldNf.Dispose()
            Write-Verbose "Finished getting Users not Found"

            Write-Verbose "Deleting Records not written in last sync..."
            $cmdDeleteNF = New-Object System.Data.SqlClient.SqlCommand "DELETE FROM [dbo].[UsersNotFound]", $SqlConnection
            $cmdDeleteNF.ExecuteNonQuery() | Out-Null
            $cmdDeleteNF.Dispose()
            Write-Verbose "Deleted Records not written in last sync"
            
            $count = $data.Tables["OutofDate"].Rows.Count
            $counter = 0
            Write-Verbose "Removing $($count) stale time related record(s) from UPS Profiles..."
            $output | Add-Member -type NoteProperty -name StaleRecordsFound -value $count
            foreach($a in $data.Tables["OutofDate"]) {
                $counter++ | Out-Null 
                $pc = ($counter / $count)
                Write-Progress -activity "Removing stale time related records" -Status $("{0:P} Complete" -f $pc) -PercentComplete $($pc * 100)
                Set-AOProfile -upspm $profileManager -connection $SqlConnection -row $a -nowrite
            }
            Write-Progress -activity "Writing User Data from last Sync to UPS" -Completed -Status "Done"
            Write-Verbose "Finished removing stale time related records."
            
            $count = $data.Tables["WhosWhoFlagChanges"].Rows.Count
            $counter = 0
            Write-Verbose "Modifying $($count) Who Who Flag(s) from UPS Profiles..."
            $output | Add-Member -type NoteProperty -name ChangesToWhosWhoFlagFound -value $count
            foreach($a in $data.Tables["WhosWhoFlagChanges"]) {
                $counter++ | Out-Null 
                $pc = ($counter / $count)
                Write-Progress -activity "Updating Whos Who Flag records" -Status $("{0:P} Complete" -f $pc) -PercentComplete $($pc * 100)
                Set-AOProfile -upspm $profileManager -connection $SqlConnection -row $a -nowrite
            }
            Write-Progress -activity "Writing User Data from last Sync to UPS" -Completed -Status "Done"
            Write-Verbose "Finished removing stale time related records."
            
            
            $count = $data.Tables["UsersNotFound"].Rows.Count
            $counter = 0
            Write-Verbose "Writing $($count) record(s) that were not found in the UPS on last sync..."
            $output | Add-Member -type NoteProperty -name ProfilesAttemptingReload -value $count
            foreach($a in $data.Tables["UsersNotFound"]) {
                $counter++ | Out-Null 
                $pc = ($counter / $count)
                Write-Progress -activity "Writing User Data from last Sync to UPS" -Status $("{0:P} Complete" -f $pc) -PercentComplete $($pc * 100)
                Set-AOProfile -upspm $profileManager -connection $SqlConnection -row $a
            }
            Write-Progress -activity "Writing User Data from last Sync to UPS" -Completed -Status "Done"
            Write-Verbose "Finished writing records that were not found in UPS on last sync."
            
            $count = $data.Tables["Staff"].Rows.Count
            $counter = 0
            Write-Verbose "Writing $($count) record(s) to UPS..."
            $output | Add-Member -type NoteProperty -name ProfilesToLoad -value $count
            foreach($a in $data.Tables["Staff"]) {
                $counter++ | Out-Null 
                $pc = ($counter / $count)
                Write-Progress -activity "Writing User Data to UPS" -Status $("{0:P} Complete" -f $pc) -PercentComplete $($pc * 100)
                Write-Verbose "Build relationships for $($a.DisplayName)..."
                
                $relationships = ""
				$pas = ""
                $suggestions = ""

                $sug = @()

                #foreach($r in $data.Tables["Relationships"].Select("EmployeeId = '$($a.EmployeeId)'")) {
				foreach($r in $data.Tables["Relationships"].Select("RightId = '$($a.EmployeeId)' OR (RelationshipType ='G' AND LeftEmployeeId = '$($a.EmployeeId)')")) {
                    # Set the Relationship Weight here!!!

                    $weighting = 100
                    
                    $sqlW = "Relationship = '$($r.Relationship -replace "`'", "`'`'")'"
                    $r1 = $data.Tables["Weightings"].Select($sqlW)
                    if ($r1.Length -gt 0) {
                        $weighting = $r1[0].Weighting
                    }

                    if ($weighting -gt 0)
                    {
                        $relation = $r.Relationship
                        if ($relation.StartsWith("'s") -and $r.LeftEmployeeName.EndsWith("s")) {
                            $relation = $relation.Replace("'s", "'")
                        } elseif (-not $relation.StartsWith("'s")) {
                            $relation = " " + $relation
                        }
                        
                        $relatedphone = $r.LeftPhoneExt
                        if ($relatedphone.length -gt 0) {
                            Write-Verbose "Determining Office Shortcut for $($r.RelatedName) - $($r.LeftOffice)  ..."
                            $results = $data.Tables["OfficeExtendedData"].Select("Office = '$($r.LeftOffice)'")
                            if ($results.Length -gt 0) {
                                $relatedphone = "($($results[0].OfficeDialShortCut)) $($relatedphone)"
                            }
                        }

						if ($r.RelationshipType -eq "G" -and $r.RelationshipSubType -eq "D") {
							#Departments
							$relationships += $("<tr><td colspan=""2"" width=""100%"">{0}{1} <a href=""{3}"">{2}</a></td></tr>" -f $r.LeftEmployeeName, $relation, $r.RightName, "/Search/Pages/WhosWhoResults.aspx?k=AODepartmentDesc:""$($r.RightName)""&r=Contentclass:""urn:content-class:SPSPeople""")
						} elseif ($r.RelationshipType -eq "G" -and $r.RelationshipSubType -eq "L") {
							#Locations
							$relationships += $("<tr><td colspan=""2"" width=""100%"">{0}{1} <a href=""{3}"">{2}</a></td></tr>" -f $r.LeftEmployeeName, $relation, $r.RightName, "/Search/Pages/WhosWhoResults.aspx?k=AOOfficeLoc:""$($r.RightName)""&r=Contentclass:""urn:content-class:SPSPeople""")
						} else {
							#Individuals
							if ($r.Relationship -eq "is the PA for") {
								$pas += $("<tr><td width=""75%""><a href=""/Person.aspx?accountname={0}"">{1}</a>{2} {3}</td><td width=""25%"" class=""telephone"">{4}</td></tr>" -f $r.LeftUserName.Replace("\", "%5C"), $r.LeftEmployeeName, $relation, $r.RightName, $relatedphone)
							} else {
								$relationships += $("<tr><td width=""75%""><a href=""/Person.aspx?accountname={0}"">{1}</a>{2} {3}</td><td width=""25%"" class=""telephone"">{4}</td></tr>" -f $r.LeftUserName.Replace("\", "%5C"), $r.LeftEmployeeName, $relation, $r.RightName, $relatedphone)
							}


							$obj = new-object psObject -Property @{ 
								UserName = $r.LeftUserName
								Weight = $weighting
								Modified = $r.ModifiedOn
							}
                        
							$updated = $false
							$sug |  Where-Object {$_.UserName -eq $obj.UserName} | foreach {
								$_.Weight = $_.Weight + $obj.Weight

								if ($_.Modified -lt $obj.Modified)
								{
									$_.Modified = $obj.Modified
								}

								$updated = $true
							}

							if ($updated -eq $false)
							{
								$sug += $obj
							}
						}
                    }
                }
                
                if (-not [String]::IsNullOrEmpty($relationships))  {
                    $relationships = "<table width=""100%"" class=""whosWho"" border=""0"" cellspacing=""5"" cellpadding=""0""><tbody>" + $pas + $relationships + "</tbody></table>"
                }

                foreach ($s in $sug) {
                    $dtFormat = "{0:yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fffffff'Z'}" -f $s.Modified
                    $suggestions += "<relationship username=""$($s.UserName)"" weight=""$($s.Weight)"" modified=""$($dtFormat)"" />"
                }
                
				if (-not [String]::IsNullOrEmpty($suggestions))  {
                    $suggestions = "<?xml version=""1.0"" encoding=""utf-8""?><relationships>" + $suggestions + "</relationships>"
                }

                $a.Relationships = $relationships
                $a.Suggestions = $suggestions

                Write-Verbose "Determining Office Shortcut for $($a.DisplayName) - $($a.Office)  ..."
                $results = $data.Tables["OfficeExtendedData"].Select("Office = '$($a.Office)'")
                if ($results.Length -gt 0) {
                    $a.OfficeShortCut = $results[0].OfficeDialShortCut
                }
                
                Set-AOProfile -upspm $profileManager -connection $SqlConnection -row $a
            }
            Write-Progress -activity "Writing User Data to UPS" -Completed -Status "Done"
            Write-Verbose "Finished writing records to UPS..."
            
            Write-Verbose "Writing data to Cache..."
            $data.Tables["Staff"] | Set-Relationships -connection $SqlConnection

            $data.Tables["Staff"] | Set-Suggestions -connection $SqlConnection

            Write-Verbose "Finished writing data to Cache..."
            
            $count = $data.Tables["CurrentOutofOffice"].Rows.Count
            $counter = 0
            Write-Verbose "Writing $($count) User Out of Office record(s) to UPS..."
            $output | Add-Member -type NoteProperty -name OutOfOfficeRecords -value $count
            foreach($a in $data.Tables["CurrentOutofOffice"]) {
                $counter++ | Out-Null 
                $pc = ($counter / $count)
                Write-Progress -activity "Writing User Out of Office to UPS" -Status $("{0:P} Complete" -f $pc) -PercentComplete $($pc * 100)
                Set-AOProfile -upspm $profileManager -connection $syncdb -row $a -nowrite
            }
            Write-Progress -activity "Writing User Out of Office to UPS" -Completed -Status "Done"
            Write-Verbose "Finished writing User Out of Office to UPS..."
            
            $count = $data.Tables["CurrentSecondments"].Rows.Count
            $counter = 0
            Write-Verbose "Writing $($count) User Secondment record(s) to UPS..."
            $output | Add-Member -type NoteProperty -name SecondmentsRecords -value $count
            foreach($a in $data.Tables["CurrentSecondments"]) {
                $counter++ | Out-Null 
                $pc = ($counter / $count)
                Write-Progress -activity "Writing User Secondments to UPS" -Status $("{0:P} Complete" -f $pc) -PercentComplete $($pc * 100)
                Set-AOProfile -upspm $profileManager -connection $syncdb -row $a -nowrite
            }
            Write-Progress -activity "Writing User Secondments to UPS" -Completed -Status "Done"
            Write-Verbose "Finished writing User Secondments to UPS..."
            
            $cmdProfilesNf = New-Object System.Data.SqlClient.SqlCommand "SELECT [EmployeeId], [UserName], [DisplayName] FROM [dbo].[UsersNotFound]", $SqlConnection
            
            $rdr =$cmdProfilesNf.ExecuteReader()
            
            $result = $rdr | foreach {
                $row = $_;  
                new-object psObject -Property @{ 
                    EmployeeId = $row.Item("EmployeeId")
                    UserName = $row.Item("UserName")
                    DisplayName = $row.Item("Displayname")
                }
            }
            $output | Add-Member -type NoteProperty -name ProfilesNotFoundInUPS -value $result
            $cmdProfilesNf.Dispose()
            Write-Host "Finished Syncronisation of PS Data to UPS."
        }
        catch [System.Exception] {
            $output | Add-Member -type NoteProperty -name Error -value $_
        }

        Write-Output $output
        Write-Verbose "Leaving ProcessRecord Method of Import-AOSyncronisationData."
    }
    END {
        Write-Verbose "Entering END Method of Import-AOSyncronisationData."

        Write-Verbose "Cleaning up SP Objects"
        $site.Dispose()
        
        Write-Verbose "Cleaning up SqlClient Objects"
        if ($SqlConnection -ne $null) {
            if ($SqlConnection.State -like "Open") { $SqlConnection.Close() }
            $SqlConnection.Dispose()
        }
        
        Write-Verbose "Leaving END Method of Import-AOSyncronisationData."
    }
}

function Write-Log {

    #region Parameters
    
        [cmdletbinding()]
        Param(
            [Parameter(ValueFromPipeline=$true,Mandatory=$true)] [ValidateNotNullOrEmpty()]
            [string] $Message,

            [Parameter()] [ValidateSet(“Error”, “Warn”, “Info”)]
            [string] $Level = “Info”,
            
            [Parameter()] [ValidateRange(1,30)]
            [Int16] $Indent = 0,

            [Parameter()]
            [IO.FileInfo] $Path = ”$env:temp\PowerShellLog.txt”,
            
            [Parameter()]
            [Switch] $Clobber,
            
            [Parameter()]
            [String] $EventLogName,
            
            [Parameter()]
            [String] $EventSource = ([IO.FileInfo] $MyInvocation.ScriptName).Name,
            
            [Parameter()]
            [Int32] $EventID = 0
            
        )
        
    #endregion

    Begin {}

    Process {
        try {			
            $msg = '{0}{1} : {2} : {3}' -f (" " * $Indent), (Get-Date -Format “yyyy-MM-dd HH:mm:ss”), $Level.ToUpper(), $Message
            
            switch ($Level) {
                'Error' { Write-Error $Message }
                'Warn' { Write-Warning $Message }
                'Info' { Write-Host ('{0}{1}' -f (" " * $Indent), $Message) -ForegroundColor White}
            }

            if ($Clobber) {
                $msg | Out-File -FilePath $Path
            } else {
                $msg | Out-File -FilePath $Path -Append
            }
            
            if ($EventLogName) {
            
                try {
                  if(-not [Diagnostics.EventLog]::SourceExists($EventSource)) { 
                       [Diagnostics.EventLog]::CreateEventSource($EventSource, $EventLogName) 
                  }
                } catch [System.Security.SecurityException] {
                    [Diagnostics.EventLog]::CreateEventSource($EventSource, $EventLogName) 
                }

                $log = New-Object System.Diagnostics.EventLog  
                $log.set_log($EventLogName)  
                $log.set_source($EventSource) 
                
                switch ($Level) {
                    “Error” { $log.WriteEntry($Message, 'Error', $EventID) }
                    “Warn”  { $log.WriteEntry($Message, 'Warning', $EventID) }
                    “Info”  { $log.WriteEntry($Message, 'Information', $EventID) }
                }
            }

        } catch {
            throw “Failed to create log entry in: ‘$Path’. The error was: ‘$_’.”
        }
    }

    End {}

    <#
        .SYNOPSIS
            Writes logging information to screen and log file simultaneously.

        .DESCRIPTION
            Writes logging information to screen and log file simultaneously. Supports multiple log levels.

        .PARAMETER Message
            The message to be logged.

        .PARAMETER Level
            The type of message to be logged.
        
        .PARAMETER Indent
            The number of spaces to indent the line in the log file.

        .PARAMETER Path
            The log file path.
        
        .PARAMETER Clobber
            Existing log file is deleted when this is specified.
        
        .PARAMETER EventLogName
            The name of the system event log, e.g. 'Application'.
        
        .PARAMETER EventSource
            The name to appear as the source attribute for the system event log entry. This is ignored unless 'EventLogName' is specified.
        
        .PARAMETER EventID
            The ID to appear as the event ID attribute for the system event log entry. This is ignored unless 'EventLogName' is specified.

        .EXAMPLE
            PS C:\> Write-Log -Message "It's all good!" -Path C:\MyLog.log -Clobber -EventLogName 'Application'

        .EXAMPLE
            PS C:\> Write-Log -Message "Oops, not so good!" -Level Error -EventID 3 -Indent 2 -EventLogName 'Application' -EventSource "My Script"

        .INPUTS
            System.String

        .OUTPUTS
            No output.
    #>
}

function Update-UPSPhotoFromWhosWho 
{
    
    #This script updates a users photo in UPS
    #UPS uses the usrnameas key and Whos Who dir has employee ID
    
    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1, HelpMessage='User Profile')]
        [Microsoft.Office.Server.UserProfiles.ProfileBase]$Profile
    )
    
    $EmployeeID = $Profile["ao.employeeId"].Value

    Write-Log -Message "EmployeeID for $($Profile["AccountName"].Value) is $($EmployeeID)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
    
    
    
    $PhotoExists = $false
    $MktPath = $WhoWhoPhotoRoot + "marketing\" + $EmployeeID + ".jpg"
    $SecPath = $WhoWhoPhotoRoot + "Security\" + $EmployeeID + ".jpg"
    
    #Write-Host $MktPath
    #Write-Host $Secpath
    
    #If photo exists in mkt then use this, otherwise use security photo
    If (Test-Path  $MktPath) {
        $PhotoURL = "http://whoswho.intranet.allenovery.com/photos/marketing/" +$EmployeeID + ".jpg" 
        $PhotoExists = $true
        Write-Log -Message "Marketing Image exsists for $($Profile["AccountName"].Value)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
    }
    elseif (Test-Path  $SecPath) {
        $PhotoURL = "http://whoswho.intranet.allenovery.com/photos/security/" +$EmployeeID+ ".jpg"
        $PhotoExists = $true
        Write-Log -Message "Security Image exsists for $($Profile["AccountName"].Value)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
    }

    if ($PhotoExists) {
        $Profile["PictureURL"].Value = $PhotoURL
        $Profile.Commit();
    }
}

function Update-UPSPhotoFromSQLShare 
{

    #This script uses the same process as Lync to get photos
    #See TSG:14133919 for details

    [CmdletBinding()]
    Param(
        [Parameter(Mandatory=$true, Position=1, HelpMessage='Start Date')]
        [String]$StartDate	
    )
    
    #Get list of recently update photos, we only need the base name (file name without ext and path)
    #This should be the samAccountName
    $UsersToUpdate = Get-ChildItem $SQLShare | Where {($_.PSIsContainer -eq $false) -and ($_.LastWriteTime -gt $StartDate)} | Select BaseName
    
    # Get a handle to the Profile Manager.
    # Load SharePoint Snapin
    Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
    $snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
    if ($snapin -eq $null) {
        Add-PSSnapin "Microsoft.SharePoint.Powershell"
    }
    Write-Host -ForeGroundColor Green " (done)"
    
    #Get site objects and connect to User Profile Manager service
    Write-Host "Getting UPS..." -nonewline
    $site = Get-SPSite $siteUrl
    $context = Get-SPServiceContext $site
    $upspm = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($context) 
    Write-Host -ForeGroundColor Green " (done)"
    
    #Only run if there are photos to update
    if($UsersToUpdate.Count -gt 0){
        foreach($User in $UsersToUpdate) {
        
            $samAccountName = "$($aodomain)\$($User.BaseName)"
            
            Write-Log -Message "Process Image for $($samAccountName)" -Level "Info" -Path $fileName -EventLogName $logName -EventSource $logSource
            
            if ($upspm.UserExists($samAccountName)) {
            
                $up = $upspm.GetUserProfile($samAccountName)
                #$EmployeeID = $up["ao.employeeId"].Value
                
                Update-UPSPhotoFromWhosWho -Profile $up
                
                #Update-UPSPhotoFromWhosWho -EmployeeID $EmployeeID -OmniaID $samAccountName
                Write-Verbose "Updated photo for $samAccountName"
            }
        }
        
        #Run job to create thumbnails
        Update-SPProfilePhotoStore –MySiteHostLocation $mySiteUrl
        
    }
}