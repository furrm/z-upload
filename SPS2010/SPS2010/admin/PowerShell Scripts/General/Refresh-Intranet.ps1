$url = "http://global.intranet.allenovery.com"
$WebSolutionPackages = "AO.IATK.SharePoint.wsp"


#Import Function Definitions
Write-Host "Importing functions" -foregroundcolor green
. .\RefreshintranetFunctions.ps1

#Backup Existing WSPs
Write-Host "Backing up Farm WSP files" -foregroundcolor green
& "D:\Script\Backup-FarmWSPs.ps1"

#Uninstall
#Write-Host "Uninstalling IATK WSPs" -foregroundcolor green
#
#foreach( $SolutionPackageName in $WebSolutionPackages){
#
#	RemoveSolution $SolutionPackageName $url
#
#}


#Backup Current Environment



#Import Term Store
& "D:\Script\CreateTermSetAndTerms.ps1" -url $url -TermStoreTitle "Managed Metadata Service" -xmlpath D:\GSP\Export\ProdTermStoreData.xml
& "D:\Script\CreateTermSetAndTerms.ps1" -url $url -TermStoreTitle "Managed Metadata Service" -xmlpath D:\GSP\Export\ProdTermStoreIATK.xml

#DisMount, Restore SQL & Mount

Dismount-SPContentDatabase GSP_FARM_Intranet_Content

$choice = Ask-YesOrNo "Has the SQL database been resored?"

if ($choice -eq $false)
{
    RETURN
}



Mount-SPContentDatabase GSP_FARM_Intranet_Content -DatabaseServer GSP_IntranetDB -WebApplication $url


#Exit Script

#Wire up MMS Fields
& "D:\Script\WireUpMetadataColumns.ps1"


#Delete Scope
#Delete Managed Properties

#Index Reset and Full Crawl


#Delete Secure Store Entry

#Delete KnowHow Database


#Delete Know How user

#Delete Know How Term Group










































#ALTER DATABASE GSP_FARM_Intranet_Content SET single_user with rollback immediate

#RESTORE DATABASE 
#GSP_FARM_Intranet_Content
#FROM DISK = 'E:\SQLBACKUPS\GSP_FARM_Intranet_Content_20140330220324980_DATABASE.bak'
#WITH REPLACE


#ALTER DATABASE GSP_FARM_Intranet_Content SET multi_user
