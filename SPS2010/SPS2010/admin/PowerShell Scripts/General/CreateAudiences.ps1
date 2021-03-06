#Script to create audiences based on Managed Metadata Structure


#Creates an audience with a rule at the level of the term passed in and a rule for any terms one l level down from term passed in
function CreateAudienceFromTermSet {

	param($TermRoot,$TermLabel,$FieldName,$NameStem)
	#
	foreach($Term in $TermRoot.Terms) {
	    #Remove & and spaces  (replace("&","") doesnt work ?
	    $WordArray = $Term.Name.Split(" ")
	    $AudienceName=$NameStem 
	    
	    foreach($Word in $WordArray){
	        if($Word.Length -gt 1) {
	            $AudienceName += $Word
	        }
	    }

		$NewAudience = $false

		#Check to see if audience already exists	
		if ($audcollection.AudienceExist($AudienceName)) {
		
			#Get list of metadata id used in rules
			$Audience = $audmanager.GetAudience($AudienceName)
			$AudienceRules = $Audience.AudienceRules
			$AudienceRuleIDs = $AudienceRules | Where {$_.Operator -eq "Contains"} | Select RightContent
			$AudienceRuleIDsArrary = New-Object System.Collections.ArrayList
			
			foreach($id in $AudienceRuleIDs){
				$AudienceRuleIDsArrary.add($($id.RightContent)) | Out-Null
			}
			
			$AudienceRuleIDsArrary.Sort()
			
			#Get List of metadata ids
			$MMSIDsArray = New-Object System.Collections.ArrayList
			$MMSIDsArray.Add($Term.id)  | Out-Null
			if ($Term.TermsCount -gt 0) {
				foreach($SubTerm in $Term.Terms) {
					$MMSIDsArray.Add($SubTerm.id)  | Out-Null
				}
			}
			$MMSIDsArray.Sort()
			
			$UpdateRules = $false
			
			if ($MMSIDsArray.count -ne $AudienceRuleIDsArrary.Count){
				Write-Host "Different number of ids"
				$UpdateRules = $true
			}
			else{
				#Numbers the same now check the ids

				for ($i=0;$i -lt $MMSIDsArray.count;$i ++) {
				
					if ($MMSIDsArray[$i] -ne $AudienceRuleIDsArrary[$i]) {
						Write-Host "$($AudienceName) Ids different $($MMSIDsArray[$i]) -  $($AudienceRuleIDsArrary[$i])"
						$UpdateRules = $true
					}
				}
			}
		}
		else {
			#Create New Audience
			$IsNewAudience = $true
			$AudienceDesc = "$($Term.Name) $TermLabel"
			$Audience = $audcollection.Create($AudienceName,$AudienceDesc)
			#$Audience.AudienceRules = New-Object System.Collections.ArrayList
			
	        $Audience.OwnerAccountName = "$($env:userdomain)\zadmbarryr"
		}
		
		#Clease existing rules
		#if($UpdateRules -eq $true) {
		#	$Audience.AudienceRules.Clear()
		#}
		
		if (($IsNewAudience -eq $true) -or ($UpdateRules -eq $true) ) {
		
			$AudienceRuleCollection = New-Object System.Collections.ArrayList
			$Audience.AudienceRules = $AudienceRuleCollection
			$Audience.Commit()
		
			$NewRule = New-Object Microsoft.Office.Server.Audience.AudienceRuleComponent($FieldName,"Contains",$Term.id)
			#$Audience.AudienceRules.Add($NewRule)
			$AudienceRuleCollection.Add($NewRule)
	
			#Check to see if this term has child terms and if so add rules for those
			if ($Term.TermsCount -gt 0) {
				foreach($SubTerm in $Term.Terms) {
	    			#Additional rules need to be OR
					$NewRule = New-Object Microsoft.Office.Server.Audience.AudienceRuleComponent($null,"OR",$null)
					#$Audience.AudienceRules.Add($NewRule) | Out-Null
					$AudienceRuleCollection.Add($NewRule)

					$NewRule = New-Object Microsoft.Office.Server.Audience.AudienceRuleComponent($FieldName,"Contains",$SubTerm.id)
					#$Audience.AudienceRules.Add($NewRule) | Out-Null
					$AudienceRuleCollection.Add($NewRule)
				}
			}
			
			$Audience.AudienceRules = $AudienceRuleCollection
			
			#Write-Host "Commit"
			$Audience.Commit()

		}

		
	}
}






#Set up Connection to Audiences
[System.Reflection.Assembly]::LoadWithPartialName("Microsoft.Office.Server.Audience") | Out-Null

$url = "http://global.intranet.allenovery.com"
$spsite=new-Object Microsoft.SharePoint.SPSite($url)
$spcontext=[Microsoft.Office.Server.ServerContext]::GetContext($spsite)
$audmanager=New-Object Microsoft.Office.Server.Audience.AudienceManager($spcontext)
$audcollection=$audmanager.Audiences

#Set up connection to Term Store
$TaxonomySession = Get-SPTaxonomySession -Site $spsite
$TermStore = $TaxonomySession.TermStores["Managed Metadata Service"]
$TermStoreGroup = $TermStore.Groups["Intranet Group"]

#Create audience starting at Term Group Level
$TeamsTermSet = $TermStoreGroup.TermSets["Teams"]
#$Practices = $TeamsTermSet.Terms["Practices"]
$Sectors = $TeamsTermSet.Terms["Sectors"]

#Practices not currently required
#CreateAudienceFromTermSet -TermRoot $Practices -TermLabel "Practice" -FieldName "AOPrimaryTeam"
CreateAudienceFromTermSet -TermRoot $Sectors -TermLabel "Sector" -FieldName "AOPrimaryTeam" -NameStem "Sector_"


#Create audience starting at 1 level below Term Group Level 
$LocationTermSet = $TermStoreGroup.TermSets["Location"]

foreach($Continent in $LocationTermSet.Terms) {

    if ($Continent.TermsCount -gt 0) {
        CreateAudienceFromTermSet -TermRoot $Continent -TermLabel "Location" -FieldName "AOPrimaryLocation" -NameStem "$($Continent.Name)_"
    
		#Find out if current node has sub terms as these are offices
		$Countries = $Continent.Terms
		foreach ($Country in $Countries) {
			
			#See if the country has multiple offices, if so create audience for the office
			if ($Country.TermsCount -gt 0){
				CreateAudienceFromTermSet -TermRoot $Country -TermLabel "Office" -FieldName "AOPrimaryLocation" -NameStem "$($Continent.Name)_$($Country.Name)_"
			}
		}
    }
}




