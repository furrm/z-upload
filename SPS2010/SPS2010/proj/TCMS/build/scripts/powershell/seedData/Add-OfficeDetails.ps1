Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue

function Add-OfficeDetails()
{
	<#
		.Example
			Add-OfficeDetails -ListName "Office Details" -Url "http://ddvm9093-sps1" -OfficeDetails (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\seedData\OfficeDetails.csv") -CommonScriptWorkingDirectory "E:\BuildAgent\work\common\Main\build\scripts\powershell\FarmInstall"
	#>
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[String]
		$Url,
		[Parameter(Mandatory=$true, Position=1)]
		[String]
		$ListName,
		[Parameter(Mandatory=$true, Position=2)]
		[array]
		$OfficeDetails,
		[Parameter(Mandatory=$true, Position=3)]
		[array]
		$OfficeDetailsToRemove,
		[Parameter(Mandatory=$true, Position=4)]
		[String]
		$CommonScriptWorkingDirectory
	)
	begin{
		#START DEBUG
		Write-Output "Url: $Url"
#		Write-Output "ListName: $ListName"
#		Write-Output "Document Type Count: " + $DocumentTypes.Count.ToString()
#		Write-Output "CommonScriptWorkingDirectory: $CommonScriptWorkingDirectory"
		#END DEBUG
		
		Set-Location $CommonScriptWorkingDirectory
		Import-Module ".\..\Lists\Get-ListItemByKeyVal.ps1" -ErrorAction:Stop
		
		$Url = $Url
		$ListName = $ListName

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
		
		$list1 =  $web.Lists["Office Language"]
	}
	process{
		
		Write-Output  ("Office Detail Count: " + $OfficeDetails.Count.ToString())
		#Before adding office details to TCMS, we need to remove offices from the array first.
		
		#Create a generic list of offices to remove and copy values from the $OfficeDetailsToRemove array into it.
		$OfficeDetailsToRemoveList = New-Object 'System.Collections.Generic.List[String]'
		
		foreach($OfficeDetailToRemove in $OfficeDetailsToRemove)
		{
			$OfficeDetailsToRemoveList.Add(($OfficeDetailToRemove.OfficeName + "|" + $OfficeDetailToRemove.BookmarkName))
		}
		
		#Create a new office details array and only copy the values from the $OfficeDetails array that don't
		#exist in the $OfficeDetailsToRemoveList.
		
		$NewOfficeDetails = @()
		
		foreach($OfficeDetail in $OfficeDetails)
		{
			if(-not $OfficeDetailsToRemoveList.Contains(($OfficeDetail.OfficeName + "|" + $OfficeDetail.BookmarkName))) 
			{
				$NewOfficeDetails += ,$OfficeDetail
			}
		}
		
		#Clear the $OfficeDetails array.
		$OfficeDetails = $null
		
		Write-Output ("Office Detail to Remove Count: " + $OfficeDetailsToRemove.Count.ToString())
		
		$OfficeDetails = $NewOfficeDetails
		
		Write-Output  ("Office Detail Count: " + $OfficeDetails.Count.ToString())
		
		#Add office details to TCMS
		foreach($officedetail in $OfficeDetails)
		{
			
			$listItem = $listItems.Add()
			
		#	$listItems | Select InternalName | Format-Wide
			
			$changeRef = "RI0"  #+ $rand.Next(100)
			
		#	Get the CR item.
			$li = Get-ListItemByKeyVal -Url $Url -ListName "Request ID"  -Key "Title" -Val "$changeRef"
			$changeRefLookupVal = $li.ID.ToString() + ";#" + $li.Title 
			
			#Get Office Lookup
			$officeitem = Get-ListItemByKeyVal -Url $Url -ListName "Office"  -Key "Title" -Val $officedetail.OfficeName
			$officeID = $officeitem.ID.ToString()
			$OfficeIDLookupVal = $officeitem.ID.ToString() + ";#" + $officeitem.ID.ToString() 

			#Get Office Element Lookup
			$officeElement = Get-ListItemByKeyVal -Url $Url -ListName "Office Elements"  -Key "Title" -Val $officedetail.OfficeElement
			$OfficeElementLookupVal = $officeElement.ID.ToString() + ";#" + $officeElement.Title
			
			#Get Language Lookup
			if ($officedetail.LanguageName) 
			{

				$languageListItem = Get-ListItemByKeyVal -Url $Url -ListName "Language"  -Key "Title" -Val $officedetail.LanguageName
				$languageID = $languageListItem.ID.ToString()

				$caml = "<Where>
							<And>
								<Eq>
									<FieldRef Name='OfficeNameLookup' LookupId='TRUE' />
									<Value Type='Lookup'>" + $officeID + "</Value>
								</Eq>
								<Eq>
									<FieldRef Name='LanguageNameLookup' LookupId='TRUE' />
									<Value Type='Lookup'>" + $languageID + "</Value>
								</Eq>
							</And>
						</Where>"
				$query=new-object Microsoft.SharePoint.SPQuery     
				$query.Query=$caml 
				$col=$list1.GetItems($query)[0] 
				foreach ($r in $col) 
				{
					$OfficeLanguageID = $r.ID.ToString()+ ";#" + $r.ID.ToString()
				}

			}

			
			$listItem["OfficeID"] = $OfficeIDLookupVal
			
			if ($officedetail.LanguageName) 
			{
				$listItem["OfficeLanguageID"] = $OfficeLanguageID
			}
			$listItem["OfficeElement"] = $OfficeElementLookupVal
			$listItem["ElementValue"] = $officedetail.Translation
			$listItem["ChangeRecordRef"] = $changeRefLookupVal  #$changeRef

			$listItem.Update();
			
		}
	}
	end{
		$OfficeLanguages -eq $null
		
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}
}


