Write-Host "Wiring up Started"

if ((Get-PSSnapin "Microsoft.SharePoint.PowerShell" -ErrorAction SilentlyContinue) -eq $null) {
    Add-PSSnapin "Microsoft.SharePoint.PowerShell"
}

$site = get-spsite -Identity http://global.intranet.allenovery.com
$spWeb = $site.OpenWeb()

$session = get-sptaxonomysession -site $site
$termstore = $session.termstores["Managed Metadata Service"]
$intranetTermGroup = $termstore.groups["Intranet Group"]
$improvingAccessToKnowledgeTermGroup = $termstore.groups["Improving Access to Knowledge Group"]

# Wire up Client column
Write-Host "Wiring up Client column"
$termSet = $intranetTermGroup.TermSets["Clients"]
$field = $spWeb.Fields["Client"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Clients column
Write-Host "Wiring up Clients column"
$termSet = $intranetTermGroup.TermSets["Clients"]
$field = $spWeb.Fields["Clients"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Event Host Office column
Write-Host "Wiring up Event Host Office column"
$termSet = $intranetTermGroup.TermSets["Location"]
$field = $spWeb.Fields["Event Host Office"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Event Type column
Write-Host "Wiring up Event Type column"
$termSet = $intranetTermGroup.TermSets["Event Type"]
$field = $spWeb.Fields["Event Type"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up IT Training Category column
Write-Host "Wiring up IT Training Category column"
$termSet = $intranetTermGroup.TermSets["Training Category"]
$term = $termSet.Terms["IT Training"]
$field = $spWeb.Fields["IT Training Category"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.AnchorId = $term.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up LegalTrainingCategory column
Write-Host "Wiring up LegalTrainingCategory column"
$termSet = $intranetTermGroup.TermSets["Training Category"]
$term = $termSet.Terms["Legal Technical Training"]
$field = $spWeb.Fields["LegalTrainingCategory"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.AnchorId = $term.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Library Category column
Write-Host "Wiring up Library Category column"
$termSet = $intranetTermGroup.TermSets["Library Category"]
$field = $spWeb.Fields["Library Category"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Link Category column
Write-Host "Wiring up Link Category column"
$termSet = $intranetTermGroup.TermSets["Link Category"]
$field = $spWeb.Fields["Link Category"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

                # Wire up Location column
                Write-Host "Wiring up Location column"
                $termSet = $intranetTermGroup.TermSets["Location"]
                $field = $spWeb.Fields["LocationSingle"]  
                $field.sspid = $termstore.id
                $field.termsetid = $termSet.id
                $field.PushChangesToLists = $true
                $field.Update()

# Wire up Location column
Write-Host "Wiring up Locations column"
$termSet = $intranetTermGroup.TermSets["Location"]
$field = $spWeb.Fields["Locations"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up PolicyCategories column
Write-Host "Wiring up PolicyCategories column"
$termSet = $intranetTermGroup.TermSets["Policy Category"]
$field = $spWeb.Fields["PolicyCategories"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up PolicyCategory column
Write-Host "Wiring up PolicyCategory column"
$termSet = $intranetTermGroup.TermSets["Policy Category"]
$field = $spWeb.Fields["PolicyCategory"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Practices column
Write-Host "Wiring up Practices column"
$termSet = $intranetTermGroup.TermSets["Teams"]
$term = $termSet.Terms["Practices"]
$field = $spWeb.Fields["Practices"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.AnchorId = $term.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up PublicationCategory column
Write-Host "Wiring up PublicationCategory column"
$termSet = $intranetTermGroup.TermSets["Publication Category"]
$field = $spWeb.Fields["PublicationCategory"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Roles column
Write-Host "Wiring up Roles column"
$termSet = $intranetTermGroup.TermSets["Roles"]
$field = $spWeb.Fields["Roles"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Skills Training Category column
Write-Host "Wiring up Skills Training Category column"
$termSet = $intranetTermGroup.TermSets["Training Category"]
$term = $termSet.Terms["Skills Training ＆ Development"]
$field = $spWeb.Fields["Skills Training Category"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.AnchorId = $term.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Team column
Write-Host "Wiring up Team column"
$termSet = $intranetTermGroup.TermSets["Teams"]
$field = $spWeb.Fields["Team"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Teams column
Write-Host "Wiring up Teams column"
$termSet = $intranetTermGroup.TermSets["Teams"]
$field = $spWeb.Fields["Teams"]  
$field.sspid = $termstore.id
$field.termsetid = $termSet.id
$field.PushChangesToLists = $true
$field.Update()

# Wire up Knowledge Language column
#Write-Host "Wiring up Knowledge Language column"
#$termSet = $improvingAccessToKnowledgeTermGroup.TermSets["Language"]
#$field = $spWeb.Fields["Knowledge Language"]  
#$field.sspid = $termstore.id
#$field.termsetid = $termSet.id
#$field.PushChangesToLists = $true
#$field.Update()

# Wire up Knowledge Location column
#Write-Host "Wiring up Knowledge Location column"
#$termSet = $improvingAccessToKnowledgeTermGroup.TermSets["Location"]
#$field = $spWeb.Fields["Knowledge Location"]  
#$field.sspid = $termstore.id
#$field.termsetid = $termSet.id
#$field.PushChangesToLists = $true
#$field.Update()

# Wire up Knowledge Team column
#Write-Host "Wiring up Knowledge Team column"
#$termSet = $improvingAccessToKnowledgeTermGroup.TermSets["Teams"]
#$field = $spWeb.Fields["Knowledge Team"]  
#$field.sspid = $termstore.id
#$field.termsetid = $termSet.id
#$field.PushChangesToLists = $true
#$field.Update()

$spWeb.update()

Write-Host "Wiring up Complete"