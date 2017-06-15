function Add-ChangeListItems(){
	<#
		.Example
		Add-ChangeListItems -ListName "Request ID" -Url "http://ddvm9093-sps1" -NumberOfItemsToAdd 100
	#>
	param
	(
		[Parameter(Mandatory=$true, Position=0)]
		[String]
		$Url,
		[Parameter(Mandatory=$true, Position=1)]
		[String]
		$ListName,
		[Parameter(Mandatory=$true, Position=2)]
		[int]
		$NumberOfItemsToAdd
      )
	begin{
		$web = Get-SPWeb $Url
    	$list =  $web.Lists[$ListName]
		$listItems = $list.Items
		
#		$rand = New-Object  System.Random
	  }
	  process{
	  
	  	$i = -1
		
	  	do
		{
#			$changeRef = $rand.next(100, (100 + $NumberOfItemsToAdd))
			$i++

		  	$listItem = $listItems.Add()
			
#			$listItem["Title"] = "$changeRef"
			$listItem["Title"] = "RI" + "$i"
			$listItem["ChangeRecordDesc"] = "Auto Generated " + "$i"
			$listItem["ReleaseDate"] = [System.DateTime]::Now.AddDays(10)
			$listItem.Update();
			
			$listItem = $null
		}
		until($i -eq $NumberOfItemsToAdd)
		
	  }
	  end{
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	  }
}