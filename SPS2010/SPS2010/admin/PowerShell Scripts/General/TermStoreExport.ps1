function AddTermsRecursive {

	param($Terms,$TermSetElement,$MMSExport)

	foreach ($Term in $Terms) {
	
		$TermElement = $MMSExport.CreateElement("term")
		$TermElement.SetAttribute("name",$(SafeXML $($Term.Name)))
		$TermElement.SetAttribute("description","")
		$TermElement.SetAttribute("lcid","1033")
		$TermElement.SetAttribute("guid",$Term.id)
		$TermElement.SetAttribute("taggingEnabled",$Term.IsAvailableForTagging)
		$TermSetElement.AppendChild($TermElement)
		
		if ($Term.TermsCount -gt 0) {
		
			AddTermsRecursive -Terms $($Term.Terms) -TermSetElement $TermElement -MMSExport $MMSExport
	
		}
	}
}


function SafeXML {

	param([string] $Text)
	
	#$Text = $Text.Replace('"','&quot;')
	#$Text = $Text.Replace("'",'&apos;')
	#$Text = $Text.Replace("<",'&lt;')
	#$Text = $Text.Replace(">",'&gt;')
	#$Text = $Text.Replace("&",'&amp;')
	
	#Return [System.Security.SecurityElement]::Escape($text)
	
	Return $Text
}




$url = "http://global.intranet.allenovery.com"
$spsite=new-Object Microsoft.SharePoint.SPSite($url)
$spcontext=[Microsoft.Office.Server.ServerContext]::GetContext($spsite)

#Set up connection to Term Store
$TaxonomySession = Get-SPTaxonomySession -Site $spsite
$TermStore = $TaxonomySession.TermStores["Managed Metadata Service"]
$TermStoreGroup = $TermStore.Groups["Intranet Group"]


$MMSExport = New-Object System.Xml.XmlDocument

#Set up the root element
$root = $MMSExport.CreateElement("group")
$root.SetAttribute("name","Intranet Group")
$root.SetAttribute("description","Intranet Group")
$MMSExport.AppendChild($root)


foreach ($TermSet in $TermStoreGroup.TermSets) {

	Write-Host $TermSet.Name
	Write-Host $TermSet.id
	Write-Host $TermSet.IsAvailableForTagging

	$TermSetElement = $MMSExport.CreateElement("termSet")
	$TermSetElement.SetAttribute("name",$(SafeXML $($TermSet.Name)))
	$TermSetElement.SetAttribute("description","")
	$TermSetElement.SetAttribute("lcid","1033")
	$TermSetElement.SetAttribute("guid",$TermSet.id)
	$TermSetElement.SetAttribute("taggingEnabled",$TermSet.IsAvailableForTagging)
	$root.AppendChild($TermSetElement)
	
	AddTermsRecursive -Terms $($TermSet.Terms) -TermSetElement $TermSetElement -MMSExport $MMSExport
	
}


$Encoding = [System.Text.Encoding]::Unicode
$StreamWriter = New-Object System.IO.StreamWriter "C:\temp\mss.xml",$True,$Encoding

$TextWriter = [System.IO.TextWriter]$StreamWriter

#System.IO.TextWriter$TextWriter = New-Object System.IO.TextWriter $StreamWriter

$MMSExport.Save($TextWriter)

$TextWriter.Close()


#$MMSExport.Save("C:\temp\mss.xml")










#<group name="Improving Access to Knowledge Group" description="Improving Access to Knowledge Group">
