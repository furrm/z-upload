#SnapIn Check
If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{
	Write-Output "Adding Microsoft.SharePoint.PowerShell snapin..."
	Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell
	Write-Output "Microsoft.SharePoint.PowerShell snapin added..."
	
}
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

function Create-SiteCollection
{
	<#
	.SYNOPSIS
	Creates a site collection.
	
	.SiteTemplate
	Site template for the collection, such as, GLOBAL#0 = Global template, STS#0=Team Site, STS#1-Blank Site 
	#>
	Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url,
		[Parameter(Mandatory=$true)]
		[String]
		$SiteCollectionOwner,
		[Parameter(Mandatory=$true)]
		[String]
		$LCID,
		[Parameter(Mandatory=$true)]
		[String]
		$SiteTemplate,
		[Parameter(Mandatory=$true)]
		[String]
		$SiteCollectionName
	)
	Process
	{
	$Output = ""
	
	# Create a new Sharepoint Site Collection
	New-SPSite -URL $Url -OwnerAlias $SiteCollectionOwner -Language $LCID -Template $SiteTemplate -Name $SiteCollectionName -Verbose -OutVariable $Output

	Write-Output $Output
	}
}

