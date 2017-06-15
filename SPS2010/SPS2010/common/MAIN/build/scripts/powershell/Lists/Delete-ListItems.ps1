
Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue


function Get-Web(){
	begin{
		$web = Get-SPWeb -Identity "http://ddvm9093-sps1"
	}
	end{
		$web.Dispose()
		$web = $null
	}
}

function Delete-ListItems(){
	<#
		.Example
		Delete-ListItems -ListName "Change Record" -Url "http://ddvm9093-sps1"
	#>
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[String]
		$Url,
		[Parameter(Mandatory=$true, Position=1)]
		[String]
		$ListName
	)
	begin{
		$web = Get-SPWeb $Url
    	$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
#		$items=$list.GetItems($query)
#		Write-Host $items.Count

		$listItems | % { $list.GetItemById($_.Id).Delete() }
	}
	end{
		$web.Dispose()
		$web = $null
	}
}

