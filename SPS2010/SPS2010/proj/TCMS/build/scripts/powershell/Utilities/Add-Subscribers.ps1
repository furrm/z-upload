function Add-Subscribers
{
	<#
		.Example
			Add-Subscribers -Count 10 -Url "http://ddvm9093-sps1"
	#>
	param(
		[Parameter(Mandatory=$true, Position=0)]
		[String]
		$Url,
		[Parameter(Mandatory=$true, Position=3)]
		[Int32]
		$Count
		)
		
		begin{
		#START DEBUG
		Write-Output "Url: $Url"
		#END DEBUG
		
		#Get a random Request ID number.
		#$rand = New-Object  System.Random(1)
		$Url = $Url
		$ListName = "TCMS Subscribers"

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		$i = 0;
		do
		{
			$i++;
			Write-Output ("DDVM" + $i);
			
			$dateTime = New-Object -TypeName System.DateTime
			
			$listItem = $listItems.Add()
			$listItem["Title"] = ("DDVM" + $i);
			$listItem["DateRegistered"] = [System.DateTime]::Now.ToString()
			$listItem["Retries"] = 0;
			$listItem["IsSubscribed"] = 1;
			$listItem["SubscriberStatus"] = "OK";
			$listItem.Update();
		}
		until($i -eq $Count)
		
	}
	end{
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
		
		Write-Output "Done";
	}
}