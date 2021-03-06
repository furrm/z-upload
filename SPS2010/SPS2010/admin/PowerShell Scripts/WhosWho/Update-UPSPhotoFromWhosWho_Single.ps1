
#Setup Global variables, these may alread exist or be part of a variables file
$url = "http://global.intranet.allenovery.com"
$site = Get-SPSite $url
$context = Get-SPServiceContext $site
$userProfileManager = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($context)
$WWPhotoRoot = "\\lnsiweb56\photos\"
$domain = "OMNIA"
$SQLShare = "\\lnsisql69\adimages$"


function Update-UPSPhotoFromWhosWho {
	
	#This script updates a users photo in UPS
	#UPS uses the usrnameas key and Whos Who dir has employee ID
	
	[CmdletBinding()]
    Param(
		[Parameter(Mandatory=$false, Position=1, HelpMessage='User Profile Manager Object')]
		[Microsoft.Office.Server.UserProfiles.UserProfileManager]$upspm = $userProfileManager,
		[Parameter(Mandatory=$true, Position=2, HelpMessage='OmniaId')]
		[String]$OmniaID,	
		[Parameter(Mandatory=$true, Position=3, HelpMessage='EmployeeId')]
		[String]$EmployeeID,
		[Parameter(Mandatory=$false, Position=4, HelpMessage='Whos Who photo directory')]
		[String]$WhoWhoPhotoRoot = $WWPhotoRoot,
		[Parameter(Mandatory=$false, Position=5, HelpMessage='Domain')]
		[String]$domainName = $domain
    )
	
	$PhotoExists = $false
	$MktPath = $WhoWhoPhotoRoot + "marketing\" + $EmployeeID + ".jpg"
	$SecPath = $WhoWhoPhotoRoot + "Security\" + $EmployeeID + ".jpg"
	$samAccountName = "$domainName\$OmniaID"
	
	Write-Host $MktPath
	Write-Host $Secpath
	Write-Host $samAccountName
	
	#If photo exists in mkt then use this, otherwise use security photo
	If (Test-Path  $MktPath) {
		$PhotoURL = "http://whoswho.intranet.allenovery.com/photos/marketing/" +$EmployeeID + ".jpg" 
		$PhotoExists = $true
		Write-Host "MKT Exists for $samAccountName"
	}
	elseif (Test-Path  $SecPath) {
		$PhotoURL = "http://whoswho.intranet.allenovery.com/photos/security/" +$EmployeeID+ ".jpg"
		$PhotoExists = $true
		Write-Host "SEC Exists for $samAccountName"
	}

	if ($PhotoExists -and $upspm.UserExists($samAccountName)) {
		$up = $upspm.GetUserProfile($samAccountName)
	
		$up["PictureURL"].Value = $PhotoURL
		$up.Commit();
		Write-Host "Updated photo for user: $OmniaID Emp:$EmployeeID with url $PhotoURL"
		

	}
	
}


#Update-SPProfilePhotoStore –MySiteHostLocation http://my.intranet.allenovery.com

