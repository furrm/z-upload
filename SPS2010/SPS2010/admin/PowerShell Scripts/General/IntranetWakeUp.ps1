#Script to Wake Up the intanet site

#Initalise
Add-PSSnapin Microsoft.SharePoint.PowerShell
set-executionpolicy remotesigned -Force

#Set up variables
$url = "http://global.intranet.allenovery.com"
$profileservice_url = $url + "/_vti_bin/userprofileservice.asmx?WSDL"
$userToLookup = "$env:userdomain\zadmbarryr"
$logfilepath = "D:\Logs\WakeUp\IntranetWakeUplog.txt"


function Get-AllURLS {

	Start-SPAssignment -Global
	
	$WebApps = Get-SPWebApplication $url

	foreach ($WebApp in $WebApps){

		$SiteCollections = $WebApp.Sites

		foreach ($SiteCollection in $SiteCollections) {

			$Webs = $SiteCollection.AllWebs

			foreach ($Web in $Webs) {
			
				$web.url.toString()
			}

		}

	}


	
	Stop-SPAssignment -Global
}


function Wakeup-Site {

	param(
		[Parameter(
			Mandatory = $true,
			Position = 0,
			ParameterSetName='',
			ValueFromPipeLine = $true)]
			[string] $SiteURL
		)
	begin{
	}
	process{
		$WebRequest = [System.Net.WebRequest]::create($SiteURL)
		$WebRequest.UseDefaultCredentials = $true
		
		try{
			$logText = "$(Get-Date) , "
			
			$WebResponse = [System.Net.WebResponse] $WebRequest.GetResponse()
			
			$ResponseStream = $WebResponse.GetResponseStream()
			$StreamReader = New-Object IO.StreamReader($ResponseStream)
			$HTML = $StreamReader.ReadToEnd()

			$logText += "`"$SiteURL`" has been woken , $(Get-Date)"

			Append-Log  $logfilepath $logText
		}
		catch{
			Append-Log $logfilepath "Unable to access `"$SiteURL`""
		}
		finally {
			$StreamReader.Close()
			$ResponseStream.Close()
			$WebResponse.Close()
		}
	}
	End{
		Append-Log $logfilepath "Finished - $(Get-Date)"
	}
}

function Append-Log {
	param([string]$logfile,[String]$text)
	
	Add-Content $logfile $text
	Write-Host $text
}



#Everybody Up !!
if(Test-Path $logfilepath){
	$log = gci $logfilepath
	$log.Delete()
}
try{
	New-Item -ItemType "file" $logfilepath
	Append-Log $logfilepath "Starting SPWakeUp - $(Get-Date) "
}
catch{
	Write-Host "Unable to create new log file - will continue to wake up sites anyway"
}




#Wake up UPS
Append-Log $logfilepath "Starting UPS Wakeup - $(Get-Date)"
$ups = New-WebServiceProxy -uri $profileservice_url -UseDefaultCredential
$userData = $ups.GetUserProfileByName($userToLookup)
Append-Log $logfilepath "Finished UPS Wakeup - $(Get-Date)"


#Wakeup Search
$searchTerm=Get-Random
Append-Log $logfilepath "Starting Search Wakeup - $(Get-Date)"
Wakeup-Site "http://global.intranet.allenovery.com/search/Pages/allresults.aspx?k=$searchTerm"
Append-Log $logfilepath "Finished Search Wakeup - $(Get-Date)"





Get-AllURLS | Wakeup-Site








