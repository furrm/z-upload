If ((Get-PSSnapIn -Name Microsoft.SharePoint.PowerShell -ErrorAction SilentlyContinue) -eq $null ) 
{
      Write-Output "Adding Microsoft.SharePoint.PowerShell snapin..."
      Add-PSSnapIn -Name Microsoft.SharePoint.PowerShell
      Write-Output "Microsoft.SharePoint.PowerShell snapin added..."
}

function Delete-List
{
      <#

            .Example

            Delete-List -Url "http://tcms.sharepoint101.com" -ListName "Change Control"

      #>

      param
      (     [Parameter(Mandatory=$true)]
            [String]
            $Url,
            [Parameter(Mandatory=$true)]
            [String]
            $ListName
      )
	  begin{
	  	Write-Host "`tDelete-List function called"
	  }
      process
      {
            $w = Get-SPWeb $Url
            $lists = $w.Lists
            $listId = $lists[$ListName].ID
			
            if($listId -ne $null)
            {
                  Write-Host "Deleting the $ListName list from $Url"

                  $lists.Delete($listId)

                  Write-Host "$ListName list deleted..."

            }
			else
			{
				Write-Host "$ListName does not exist."
			}

            $w.Dispose()
			
			$lists = $null
            $listId = $null
            $w = $null

      }
	  end{
	  	Write-Host "`tDelete-List function complete"
	  }
}

 
# $w = Get-SPWeb "http://tcms.intranet.allenovery.com"
# $lists = $w.Lists
# Write-Host $lists
 
