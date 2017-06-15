
Import-Module "S:\ao_dev\SPS2010-MASTER-FURRM\shared\MAIN\build\scripts\powershell\Create-User.ps1"


function Add-UsersToGroup
{
Param
	(
		[Parameter(Mandatory=$true)]
		[String]
		$Url,
		[Parameter(Mandatory=$true)]
		[String]
		$GroupName
	)
	Process
	{
		$users = "OMNIAD\frasern", "OMNIAD\boydaic", "OMNIAD\gallagjo", "omniad\zadmfurr", "OMNIAD\zadmsadasyap", "OMNIAD\whytonr"
	
		foreach($user in $users)
		{
			Create-User -GroupName $GroupName -Url $Url -User $user
		}
	}
}