function Sync-SPUser([string]$userName, [string]$title) {
  Get-SPSite -Limit All | foreach {
    $web = $_.RootWeb
    if ($_.WebApplication.UseClaimsAuthentication) {
      $claim = New-SPClaimsPrincipal $userName -IdentityType WindowsSamAccountName
      $user = $web | Get-SPUser -Identity $claim -ErrorAction SilentlyContinue
    } else {
      $user = $web | Get-SPUser -Identity $userName -ErrorAction SilentlyContinue
    }
    if ($user -ne $null) {
      $web | Set-SPUser -Identity $user -SyncFromAD
      
      $list = $web.Lists["User Information List"]
      $query = New-Object Microsoft.SharePoint.SPQuery
      $query.Query = "<Where><Eq><FieldRef Name='Name' /><Value Type='Text'>$userName</Value></Eq></Where>"
      foreach ($item in $list.GetItems($query)) {
        $item["JobTitle"] = $title
        $item.SystemUpdate()
      }
    }
    $web.Dispose()
    $_.Dispose()
  }
}
 