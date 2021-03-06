#----------------------------------------------------------------------------- 
# Name:               Fix-UserInformationListEntry.ps1  
# Description:        This script will update all of the User Properties that dont 
#                     that dont match whats found in the UPS 
# By:                 Simon Phillips, Parity modify from a original script by Ivan Josipovic, Softlanding.ca  
#----------------------------------------------------------------------------- 

param (
      [string] $Url = "http://thebridge.intranet.allenovery.com",
      [string] $UserName = "OMNIAU\gordoni"
      )

Write-Host "Ensuring that SharePoint PowerShell Snapin is present..." -nonewline
$snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
if ($snapin -eq $null) {
    Add-PSSnapin "Microsoft.SharePoint.Powershell"
}
Write-Host -ForeGroundColor Green " (done)"

# Load the additional dlls - These are expected to be installed on the Server in the GAC
Write-Host "Loading additional libraries..." -nonewline
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Office.Server") | Out-Null
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Office.Server.UserProfiles") | Out-Null
Write-Host -ForeGroundColor Green " (done)"

#$ErrorActionPreference = "SilentlyContinue";
 
$PropertyMap = @(
    "Title,PreferredName,Display Name",
    "EMail,WorkEmail,EMail",
    "MobilePhone,CellPhone,Mobile Phone",
    "Notes,AboutMe,About Me",
    "SipAddress,WorkEmail,Sip Address",
    "Picture,PictureURL,Picture URL",
    "Department,Department,Department",
    "JobTitle,SPS-JobTitle,Job Title",
    "FirstName,FirstName,First Name",
    "LastName,LastName,Last Name",
    "WorkPhone,WorkPhone,Work Phone",
    "UserName,UserName,UserName",
    "WebSite,WebSite,WebSite",
    "SPSResponsibility,SPS-Responsibility,Ask About Me",
    "Office,Office,Office"
);

function Process-User($user, $web)
{
    
    $web | Set-SPUser -Identity $user -SyncFromAD
    $uil = $web.SiteUserInfoList
    
    if ($upm.UserExists($($user.UserLogin))){
        $up = $upm.GetUserProfile($($user.UserLogin));
        $Query = New-Object Microsoft.SharePoint.SPQuery
        $Query.Query = "<Where><Eq><FieldRef Name='Name' /><Value Type='Text'>$($User.UserLogin)</Value></Eq></Where>"
        
        foreach ($item in $uil.GetItems($Query))
        {
            #$uil.Fields | % { Write-Host "$($_.InternalName) = $($item[$_.InternalName])" } 
            foreach ($m in $PropertyMap) {
                $mapParts = $m.Split(',')
                
                $propName = $mapParts[0];

                $upProp = $up[$($mapParts[1])];
                $name = $mapParts[2];

                if($propName -eq "Notes"){
                    Write-Host "$name Updated: $($item[$PropName]) - $($upProp[0].Replace("&nbsp;"," "))";
                    $item[$PropName] = $($upProp[0].Replace("&nbsp;"," "));
                }elseif($propName -eq "Picture"){
                    Write-Host "$name Updated: $($item[$PropName].Split(",")[0]) - $($upProp[0])";
                    $item[$PropName] = $upProp[0];
                }elseif($propName -eq "SPSResponsibility"){
                    Write-Host "$name Updated: $($item[$PropName]) - $($upProp -join ', ')";
                    $item[$PropName] = $($upProp -join ', ');
                }else{
                    Write-Host "$name Updated: $($item[$PropName]) - $upProp";
                    $item[$PropName] = $upProp;
                }
            }
        
            Write-Host "Saving: $($User.UserLogin)";
            $item.SystemUpdate();
            Write-Host "";
        }
    }
}

function Process-Site($site)
{

    $serviceContext = Get-SPServiceContext $site
    $upm = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($serviceContext)

    $rootWeb = $site.RootWeb;
    Write-Host $($site.Url);

    if ($userName)
    {
        if ($rootWeb.WebApplication.UseClaimsAuthentication) {
          $claim = New-SPClaimsPrincipal $userName -IdentityType WindowsSamAccountName
          $user = $rootWeb | Get-SPUser -Identity $claim -ErrorAction SilentlyContinue
        } else {
          $user = $rootWeb | Get-SPUser -Identity $userName -ErrorAction SilentlyContinue
        }

        Process-User $user $rootWeb
        
    } else {
        $rootWeb.SiteUsers | % { Process-User $_ $rootWeb }
    }
    
    $rootWeb.Dispose();
	#Write-Host "";
}


if($Url)
{
    $Site = Get-SPSite $Url
} 

if ($Site)
{
    Process-Site $Site
} 
else
{
    foreach ($Site in $(Get-SPSite -Limit All | ? {!$_.Url.Contains("Office_Viewing_Service_Cache")})){
        Process-Site $Site
    } 
}
