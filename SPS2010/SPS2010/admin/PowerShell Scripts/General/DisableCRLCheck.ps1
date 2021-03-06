Function DisableCRLCheck
{
	Write-Host -ForegroundColor White " - Disabling Certificate Revocation List (CRL) check..."
	ForEach($bitsize in ("","64")) 
	{			
		Copy-Item -Path $env:windir\Microsoft.NET\Framework$bitsize\v2.0.50727\CONFIG\Machine.config -Destination C:\temp\machine_$bitsize.config
		
		$xml = [xml](Get-Content $env:windir\Microsoft.NET\Framework$bitsize\v2.0.50727\CONFIG\Machine.config)
		If (!$xml.DocumentElement.SelectSingleNode("runtime")) { 
			$runtime = $xml.CreateElement("runtime")
			$xml.DocumentElement.AppendChild($runtime) | Out-Null
		}
		If (!$xml.DocumentElement.SelectSingleNode("runtime/generatePublisherEvidence")) {
			$gpe = $xml.CreateElement("generatePublisherEvidence")
			$xml.DocumentElement.SelectSingleNode("runtime").AppendChild($gpe)  | Out-Null
		}
		$xml.DocumentElement.SelectSingleNode("runtime/generatePublisherEvidence").SetAttribute("enabled","false")  | Out-Null
		$xml.Save("$env:windir\Microsoft.NET\Framework$bitsize\v2.0.50727\CONFIG\Machine.config")
	}
}

