$invocation = (Get-Variable MyInvocation).Value
$directorypath = Split-Path $invocation.MyCommand.Path

# This needs to be 'installed' on the server.
# Server Manager -> Features -> Add Features -> Remote Server Administration Tools -> Role Administration Tools -> AD DS and AD LDS Tools -> Active Directory module for Windows PowerShell
#Import-Module ActiveDirectory

Add-Type -AssemblyName System.DirectoryServices.AccountManagement 

function Write-Log {

    #region Parameters
    
        [cmdletbinding()]
        Param(
            [Parameter(ValueFromPipeline=$true,Mandatory=$true)] [ValidateNotNullOrEmpty()]
            [string] $Message,

            [Parameter()] [ValidateSet("Error", "Warn", "Info")]
            [string] $Level = "Info",
            
            [Parameter()] [ValidateRange(1,30)]
            [Int16] $Indent = 0,

            [Parameter()]
            [IO.FileInfo] $Path = "$env:temp\PowerShellLog.txt",
            
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
            $msg = '{0}{1} : {2} : {3}' -f (" " * $Indent), (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Level.ToUpper(), $Message
            
            switch ($Level) {
                'Error' { 
					#Write-Error $Message 
					Write-Host $Message -ForegroundColor Red
					break
				}
                'Warn' { 
					Write-Host $Message -ForegroundColor Yellow
					break 
				}
                'Info' { Write-Host ('{0}{1}' -f (" " * $Indent), $Message) -ForegroundColor White; break}
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
                    'Error' { $log.WriteEntry($Message, 'Error', $EventID) }
                    'Warn'  { $log.WriteEntry($Message, 'Warning', $EventID) }
                    'Info'  { $log.WriteEntry($Message, 'Information', $EventID) }
                }
            }

        } catch {
			$ErrorMessage = $_.Exception.Message
			$msg = "Failed to create log entry.`n$($ErrorMessage)"
			Write-Host $msg -ForegroundColor Red
            throw $msg
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

function Substitute-Text
{
	[CmdletBinding()]
	Param(
		[Parameter(Mandatory=$true, Position=1)]
		[string]$text,
		[Parameter(Mandatory=$true, Position=2)]
		[System.Collections.Hashtable]$sub
	)

	if ($text.Contains("{title}") -and $sub.ContainsKey("ReportName"))
    {
        $text = $text.Replace("{title}", $sub.ReportName);
    }

	if ($text.Contains("{month}") -and $sub.ContainsKey('ReportingDate'))
	{
		$text = $text.Replace("{month}", $sub.ReportingDate)
	}

	if ($text.Contains("{country}") -and $sub.ContainsKey('Country'))
	{
		$text = $text.Replace("{country}", $sub.Country)
	}

	if ($text.Contains("{reportURL}") -and $sub.ContainsKey('ReportUrl'))
	{
		$text = $text.Replace("{reportURL}", $sub.ReportUrl)
	}

	if ($text.Contains("{url}") -and $sub.ContainsKey('Url'))
	{
		$text = $text.Replace("{url}", $sub.Url)
	}

	if ($text.Contains("{replyToEmail}") -and $sub.ContainsKey('ReplyToEmail'))
	{
		$text = $text.Replace("{replyToEmail}", $sub.ReplyToEmail)
	}

	if ($text.Contains("{replyToName}") -and $sub.ContainsKey('ReplyToName'))
	{
		$text = $text.Replace("{replyToName}", $sub.ReplyToName)
	}

	return $text
}