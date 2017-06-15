function Get-List()
{
	param(
		[Parameter(Mandatory=$true)]
		[String]
		$Url
	)
	begin{
		Write-Output "Get-List function called"
		Write-Output "Getting lists from " $Url
	}
	process{
		$web = Get-SPWeb $Url
		foreach($list in $web.Lists)
		{
			Write-Host $list
		}
	}
	end{
		Write-Output "Get-List function called"
	}
}