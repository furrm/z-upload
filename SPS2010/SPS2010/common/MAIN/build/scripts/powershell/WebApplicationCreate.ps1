#Description:	
#Create a Web Application for SharePoint 2010

#Versions:
#v1.0		Initial Script

#Help
#To use this cmdlet, open PowerShell and use the Import-Module "S:\ao_dev\SPS2010-MASTER-FURRM\shared\MAIN\build\scripts\powershell\WebApplicationCreate.ps1"

#Help Commands
cls
#Get-SPWebApplication
#Get-SPContentDatabase
#Get-SPManagedAccount

# Templates
# Name                 Title                                    LocaleId   Custom
# ----                 -----                                    --------   ------
# GLOBAL#0             Global template                          1033       False
# STS#0                Team Site                                1033       False
# STS#1                Blank Site                               1033       False
# STS#2                Document Workspace                       1033       False
# MPS#0                Basic Meeting Workspace                  1033       False
# MPS#1                Blank Meeting Workspace                  1033       False
# MPS#2                Decision Meeting Workspace               1033       False
# MPS#3                Social Meeting Workspace                 1033       False
# MPS#4                Multipage Meeting Workspace              1033       False
# CENTRALADMIN#0       Central Admin Site                       1033       False
# WIKI#0               Wiki Site                                1033       False
# BLOG#0               Blog                                     1033       False
# SGS#0                Group Work Site                          1033       False
# TENANTADMIN#0        Tenant Admin Site                        1033       False
 
# Languages
# Name                  Title
# ----                  -----
# German                1031
# English               1033
# French                1036
# Spanish               1034
 
#Add the SharePoint snapin for powershell
If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{ Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell }


	#IIS Web Site Variables
	$FQDN = "tcms.intranet.allenovery.com"
	$WebApplicationPort = 80
	$WebApplicationName = "$FQDN - $WebApplicationPort"
	$WebApplicationHostHeader = $FQDN
	#Public URL
	$Url = ("http://" + $FQDN)
	#Appication Pool Variables
	$ApplicationPoolName = "TcmsAppPool - $WebApplicationPort"
	$ApplicationPoolAccount = (Get-SPManagedAccount "OMNIAD\zadmfurr") #This needs to be a SharePoint Managed Account.
	$ContentDatabaseServer = "ddvm9093-sql1\sharepoint2010"
	$ContentDatabaseName = "Tcms_Content"
	#Site Collection
	$LCID = 1033
	$SiteCollectionOwner = "OMNIAD\zadmfurr"
	$SiteCollectionTemplate = "STS#1"
	$SiteCollectionName = "TCMS"
	
function Create-WebApplication
{
	$Output = ""
	
	#Create a new Sharepoint Web Application
	New-SPWebApplication  -Name $WebApplicationName -Port $WebApplicationPort -HostHeader $WebApplicationHostHeader -Url $Url -ApplicationPool $ApplicationPoolName -ApplicationPoolAccount $ApplicationPoolAccount -DatabaseServer $ContentDatabaseServer -DatabaseName $ContentDatabaseName  -Verbose -OutVariable $Output
	
	Write-Output $Output

}

function Create-SiteCollection
{
	$Output = ""
	
	# Create a new Sharepoint Site Collection
	New-SPSite -URL $Url -OwnerAlias $SiteCollectionOwner -Language $LCID -Template $SiteCollectionTemplate -Name $SiteCollectionName -Verbose -OutVariable $Output2

	Write-Output $Output
}

function Delete-SiteCollection
{
	$Output = ""
	
	#Delete the Sharepoint site collection.
	Remove-SPSite -Identity $Url -GradualDelete
	
	Write-Output $Output
}

function Delete-WebApplication
{
	$Output = ""
	
	#Delete the Sharepoint Web Application.
	Remove-SPWebApplication -Identity $Url -RemoveContentDatabases -DeleteIISSite -Verbose -OutVariable $Output
	
	Write-Output $Output
}


