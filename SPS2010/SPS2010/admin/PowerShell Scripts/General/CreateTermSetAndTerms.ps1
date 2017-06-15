## Script to create term store group, terms set and terms ##
#Description: This script first check if there are exisitng term group or term set present. 
#If yes, then it deletes the existing data.
#Then, it again creates new term store group, term set, terms with related info
######################################################################################


param(  [string]$url,
        [string]$TermStoreTitle,
	[string]$xmlpath
)


# Add Powershell snapIn first
if ( (Get-PSSnapin -Name "Microsoft.SharePoint.PowerShell" -ErrorAction SilentlyContinue) -eq $null )
{    
    Add-PsSnapin "Microsoft.SharePoint.PowerShell"
    Write-Host "PowerShell SnapIn added." -foregroundcolor green
}

Write-Host $url
Write-Host $TermStoreTitle

if($url -and $TermStoreTitle)
{


$site = Get-SPSite $url 
$TermStoreData = [xml] (Get-Content ($xmlpath))  
$session = new-object Microsoft.SharePoint.Taxonomy.TaxonomySession($site)  
$termstore = $session.TermStores[$TermStoreTitle]

function SetTermsRecursive ( [Microsoft.SharePoint.Taxonomy.TermSetItem]$termsetitem, $parentnode)
{

 $parentnode.term |
 ForEach-Object {
 
     ##Create the term
    if(($_.name -ne $null) -and ($_.name -ne ""))
    {
     $newterm = $termsetitem.CreateTerm($_.name, $_.lcid, $_.guid)
     if($_.taggingEnabled -ne $null)
     {
        $newterm.IsAvailableForTagging = $_.taggingEnabled
     }
     Write-Host -ForegroundColor Green "New term added as " $_.name
     
     ## Create Label
     foreach ($obj in $_.label)
     {
        if($obj.name -ne $null -and  $obj.lcid -ne $null)
        {               
             $newterm.CreateLabel($obj.name, $obj.lcid, $false)
             Write-Host -f Green "Label created with name "$obj.name
         }
      }       
     
    ##Recursive call to create terms
    if($_.term -ne $null)
     {  
        $_ |
        ForEach-Object {         
         SetTermsRecursive -termsetitem $newterm  -parentnode $_
        }
     }     
    
    }    
  }
}
 
function CreateTermStoreData()
{ 

  Write-Host -f Green START :  Creating Term Store Data
  
  if ($termstore.Groups[$TermStoreData.group.name])
  {
      DeleteTermStoreData
  } 
 
  if ($termstore.Groups[$TermStoreData.group.name] -eq $null)
  {
      ## create the group
      Write-Host -f Green Group does not exists...creating new group
      $group = $termstore.CreateGroup($TermStoreData.group.name)
      $group.Description = $TermStoreData.group.description             
      Write-Host -ForegroundColor Green New group added as $TermStoreData.group.name
       
      $TermStoreData.group.termset |
      ForEach-Object{
            ## create the termset
            $termset = $group.CreateTermSet($_.name, $_.guid, $_.lcid)
            if($_.taggingEnabled -ne $null)
            {
                $termset.IsAvailableForTagging = $_.taggingEnabled
            }
            if($_.termCreationEnabled -ne $null)
            {
                $termset.IsOpenForTermCreation = $_.termCreationEnabled
            }
            
            Write-Host -ForegroundColor Green New termset  added as $_.name
            
            SetTermsRecursive -termsetitem $termset -parentnode $_
           }
           
      $termstore.CommitAll()
   
  }
  else
  {
    Write-Host -f Red Group already exists..!
  }
 
 Write-Host -f Green END :  Creating Term Store Data
 }
 
 function DeleteTermStoreData()
 {
    Write-Host -f Green Deleting exisitng term store data..
    
    $oldGroup=$termstore.Groups[$TermStoreData.group.name]
    if($oldGroup -ne $null)
    {
        $oldGroup.TermSets|
        foreach{
         Write-Host -f Green deleting term set $_.Name 
         $_.Delete()
         $termstore.CommitAll() 
        
         } 
          Write-Host -f Green deleting term stror group $oldGroup.Name 
         $oldGroup.Delete() 
         $termstore.CommitAll() 
    }
    
    Write-Host -f Green Existing term store data deletion completed
 }
 
 
 
CreateTermStoreData
 
}
else
{
	Write-Host "Parameter not provided correctly. Aborting further execution for term store data creation script..!"-foregroundcolor Red
} 