function Get-ListItemByKeyVal()
{
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[String]
		$Url,
		[Parameter(Mandatory=$true, Position=1)]
		[String]
		$ListName,
		[Parameter(Mandatory=$true, Position=2)]
		[String]
		$Key,
		[Parameter(Mandatory=$true, Position=2)]
		[String]
		$Val
		)
	  	begin{
		$web = Get-SPWeb $Url
    	$list =  $web.Lists[$ListName]
		$listItems = $list.Items
		$listItem = [Microsoft.SharePoint.SPListItem]
		}
	  process{
	 	
		$listItem = $listItems | Where { $_["$Key"] -eq "$Val" }
		
	  }
	   end{
	   
	  	$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
		
		return $listItem
	  }
	  
}

#$li = Get-ListItemByKeyVal -Url "http://ddvm9093-sps1" -ListName "Change Record"  -Key "Title" -Val "CR67"
#Add-ChangeListItems -ListName "Change Record" -Url "http://ddvm9093-sps1" -NumberOfItemsToAdd 100