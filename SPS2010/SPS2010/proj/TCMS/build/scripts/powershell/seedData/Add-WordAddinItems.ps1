function Add-WordAddinItems
{
<#
		.Example
			Add-WordAddinItems -ListName "Word Addins" -Url "http://ddvm9093-sps1" -WordAddinElements (Import-Csv -Path "S:\ao_dev\SPS2010-MASTER-FURRM\proj\TCMS\MAIN\build\scripts\powershell\seedData\WordAddinItems.csv")
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
		$WordAddinElements
	)
	begin{
		$Url = $Url
		$ListName = $ListName

		$web = Get-SPWeb $Url
		$list =  $web.Lists[$ListName]
		$listItems = $list.Items
	}
	process{
		foreach($wordAddinElement in $WordAddinElements)
		{
			$multientry = New-Object Microsoft.Sharepoint.SPFieldLookupValueCollection($null)
			$lookupentry = New-Object Microsoft.Sharepoint.SPFieldLookupValue($wordAddinElement.Template)
			$multientry.Add($lookupentry)
			
			
			$listItem = $listItems.Add()

			$listItem["Title"] = $wordAddinElement.Title
			$listItem["ElementValue"] = $wordAddinElement.ElementValue
			$listItem["Template"] = $multientry
			#$listItem["ADGroup"] = $wordAddinElement.ADGroup
			#$listItem["ADGroup"] = "TemplDevelop"
			$listItem["ChangeRecordRef"] = $wordAddinElement.ChangeRecordRef
			
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
