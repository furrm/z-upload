function Export-UPSProperties {
####################### 
<# 
.SYNOPSIS 
Exports all UPS properties for all user profiles 
.DESCRIPTION 
Loops through each user profile and exports the properties to a csv file
.INPUTS 

.OUTPUTS 

.EXAMPLE 

.NOTES 

.LINK 

#> 

	[CmdletBinding()]
    Param(
		[Parameter(Mandatory=$false, Position=1, HelpMessage='Export file location')]
		[String]$OutFile = "C:\temp\UPSProperties.csv"
    )

	#Load SnapIn
	$snapin = Get-PSSnapin | Where-Object { $_.Name -eq "Microsoft.SharePoint.Powershell" }
        if ($snapin -eq $null) {
            Add-PSSnapin "Microsoft.SharePoint.Powershell"
        }
	
	#Get user profile manager
	$url = "http://global.intranet.allenovery.com"
	$site = Get-SPSite $url
	$context = Get-SPServiceContext $site
	$userProfileManager = New-Object Microsoft.Office.Server.UserProfiles.UserProfileManager($context)

	
	#Get list of properties available
	$UPSProperties = $userProfileManager.Properties | Select Name,IsMultivalued

	#Build CSV Header	
	$CSVHeader=""
	foreach($Property in $UPSProperties){$CSVHeader += "$($Property.Name),"}
	$CSVHeader=$CSVHeader.subString(0,$CSVHeader.Length-1)
	Set-Content -Value $CSVHeader -Path $OutFile
	
	#Loop through all profiles
	$AllProfiles = $userProfileManager.GetEnumerator()
	
	foreach($UserProfile in $AllProfiles) {
	
		$CSVRow=""
		
		foreach($Property in $UPSProperties){
		
			#For multivalue property seperate values with ;
			if($Property.IsMultivalued -eq "True") {
			
				$CellValue = ""
				
				$PropertyValues = $($UserProfile[$($Property.Name)])
			
				foreach($PropertyValue in $PropertyValues){
					$CellValue += "$($PropertyValue);"
				}
				$CSVRow += "`"$CellValue`","			
			}
			else{
				$CSVRow += "`"$($UserProfile[$($Property.Name)])`","
			}
		}
		
		$CSVRow=$CSVRow.subString(0,$CSVRow.Length-1)
		
		Add-Content -Value $CSVRow -Path $OutFile	
	}
}

Export-UPSProperties

