function Add-Config
{
<#
		.Example
			Add-Config -ListName "Config Settings" -Url "http://ddvm9093-sps1" -ConfigSettingElements (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\ConfigSettings.csv")
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
		$ConfigSettingElements
	)
	begin{
		$Url = $Url
		$ListName = $ListName

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		foreach($configSettingElement in $ConfigSettingElements)
		{
			$listItem = $listItems.Add()

			$listItem["Title"] = $configSettingElement.KeyName
			$listItem["ElementValue"] = $configSettingElement.KeyValue
			$listItem["ChangeRecordRef"] = $configSettingElement.RequestIDReference
			
			$listItem.Update();
		}
	}
	end{
		$ConfigSettingElements = $null
		$listItems = $null
		$list = $null
		$web.Dispose()
		$web = $null
	}

}
