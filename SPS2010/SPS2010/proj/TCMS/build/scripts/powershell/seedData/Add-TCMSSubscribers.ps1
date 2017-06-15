
$Url = "http://ddvm9093-sps1"
$ListName = "TCMS Subscribers"
$DateRegistered =[System.DateTime]::Now

$web = Get-SPWeb $Url
$list =  $web.Lists[$ListName]
$listItems = $list.Items

	$i = 0
	
	do
	{
	
	$i++
	
	$listItem = $listItems.Add()
	
	$listItem["Machine Name"] = "DUMM" + $i
	$listItem["DateRegistered"] = $DateRegistered
	$listItem["Retries"] = "0"
	$listItem["IsSubscribed"] = 1
	$listItem["SubscriberStatus"] = "OK"
	
	$listItem.Update()
	
	$listItem = $null
	}
	until($i -eq 100)

$listItems = $null
$list = $null
$web.Dispose()
$web = $null