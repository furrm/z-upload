#http://joanneklein.wordpress.com/2011/06/02/bulk-update-sharepoint-2010-userprofile-pictures/


#Note:  I see some references to a -CreateThumbnailsForImportedPhotos parameter on the UpdateSPProfilePhotoStore command in other blogs.  I did not use this parameter and the 3 thumbnails were successfully generated.   This was ran prior to installing the December CU.  I ran this script as the farm account.  Our organization has chosen not to sync the pictures with AD. (not that this is relevant here)

Add-PSSnapin Microsoft.SharePoint.PowerShell
#———————————————————————————
# Default Values
#———————————————————————————

$spNotFoundMsg = "Unable to connect to SharePoint.  Please verify that the site '$siteUrl’ is hosted on the local machine.";

#—————————————————–
# Load Assemblies
#—————————————————–

if ([Reflection.Assembly]::LoadWithPartialName("Microsoft.SharePoint") -eq $null)  { throw $spNotFoundMsg; }
if ([Reflection.Assembly]::LoadWithPartialName("Microsoft.Office.Server") -eq $null) { throw $spNotFoundMsg; }

#—————————————————–
# Functions
#—————————————————–

function ToSimpleString([string]$value, [bool]$trim = $true, [bool]$removeSpaces = $true, [bool]$toLower = $true)
{
	if ($value -eq $null) { return [System.String]::Empty; }
	if ($trim) { $value = $value.Trim();    }
	if ($removeSpaces) { $value = $value.Replace(" ", "");  }
	if ($toLower) { $value = $value.ToLower(); }
	return $value;
}

function GetSPSite($url)
{
	[Microsoft.SharePoint.SPSite]$site = New-Object "Microsoft.SharePoint.SPSite" -ArgumentList $url
	return $site;
}

function GetSPWeb($url)
{
	[Microsoft.SharePoint.SPSite]$site = GetSPSite -url $url;
	[Microsoft.SharePoint.SPWeb]$web = $site.OpenWeb();
	return $web
}

function GetSPList($url, $listName)
{
	$listName = (ToSimpleString -value $listName);

	[Microsoft.SharePoint.SPWeb]$web = GetSPWeb -url $url;
	foreach($list in $web.Lists)
		{
		$title = (ToSimpleString -value $list.Title);
		if ($listName -eq $title)
		{
			return $list;
		}
		}
	return $null;
}

function GetSPDocumentLibrary($url, $libraryName)
{
	[Microsoft.SharePoint.SPDocumentLibrary]$lib = [Microsoft.SharePoint.SPDocumentLibrary](GetSPList -url $url -listName $libraryName);
	return $lib;
}

function GetSPFile($libraryInstance, $fileName)
{
	$fileName = (ToSimpleString -value $fileName -removeSpaces $false);

	foreach($file in $libraryInstance.RootFolder.Files)
	{
		$itemName = (ToSimpleString -value $file.Name -removeSpaces $false);
		if ($fileName -eq $itemName)
		{
			return $file;
		}
	}
	return $null;
}

function UploadSPFile([string]$url, [string]$libraryName, [string]$filePath, [System.Text.StringBuilder]$verbose = $null)
{
	try
	{
		[Microsoft.SharePoint.SPDocumentLibrary]$lib = (GetSPDocumentLibrary -url $url -libraryName $libraryName);
		if ($lib -eq $null)
		{
			throw (([string]'Cannot find document library "') + ([string]$libraryName) + ([string]'" at url "') + ([string]$url) + ([string]'"!’));
		}

		$bytes = [System.IO.File]::ReadAllBytes($filePath);
		$fileName = [System.IO.Path]::GetFileName($filePath);

		[Microsoft.SharePoint.SPFile]$file = GetSPFile -libraryInstance $lib -fileName $fileName;

		if ($file -eq $null)
		{
			if ($verbose -ne $null)
			{
			[void]$verbose.AppendLine("Uploading File…");
			}
			$file = $lib.RootFolder.Files.Add($fileName, $bytes);
		}
		else
		{
			if ($verbose -ne $null)
			{
			[void]$verbose.AppendLine("File Exists, overwriting…");
			}
			$file.SaveBinary($bytes);
		}

		if ($verbose -ne $null)
		{
			[void]$verbose.AppendLine(($bytes.Length.ToString()) + ([string]" bytes written!"));
		}

		return $file;
	}
	catch
	{
		if ($verbose -ne $null)
		{
			[void]$verbose.AppendLine(([string]'Error: Upload to document library "') + ([string]$libraryName) + ([string]'" at "') + ([string]$url) + ([string]'" or file "') + ([string]$filePath) + ([string]'" failed!’));
			[void]$verbose.AppendLine([string]'Error: ' + [string]$error[1]);
		}
	}

	return $null;
}

function GetSpContext($url)
{
	[Microsoft.SharePoint.SPSite]$site = GetSPSite -url $url
	return [Microsoft.Office.Server.ServerContext]::GetContext($site);
}

function GetProfileManager($url)
{
	[Microsoft.Office.Server.ServerContext]$ctx = GetSpContext -url $url
	[Microsoft.Office.Server.UserProfiles.UserProfileManager]$upm = New-Object "Microsoft.Office.Server.UserProfiles.UserProfileManager" -ArgumentList $ctx

	return $upm;
}

function GetProfilePropertyName($userProfileManager, $propertyName)
{
	$propertyName = (ToSimpleString -value $propertyName);
	$propertyName = $propertyName.Replace("sps-", "");

	foreach($prop in $userProfileManager.Properties)
	{
		[string]$n = (ToSimpleString -value $prop.DisplayName);
		$n = $n.Replace("sps-", "");
		if ($propertyName -eq $n) { return $prop.Name.ToString(); }

		$n = (ToSimpleString -value $prop.Name);
		$n = $n.Replace("sps-", "");
		if ($propertyName -eq $n) { return $prop.Name.ToString(); }
	}

	return $null;
}

function CombineUrls([string]$baseUrl, [string]$relUrl)
{
	[System.Uri]$base = New-Object System.Uri($baseUrl, [System.UriKind]::Absolute);
	[System.Uri]$rel = New-Object System.Uri($relUrl, [System.UriKind]::Relative);

	return (New-Object System.Uri($base, $rel)).ToString();
}

# Get each image file in the network library
# For each file:     1.  upload to Sharepoint
#                 2.  parse the filename to get the loginname
#                 3.  update the pictureurl property on the user profile to be the image

$upm = GetProfileManager -url "http://mysitehost.ca/"

$imgfiles = get-childitem -Path "c:\FolderWhereUserProfilePicturesAreStored"

foreach ($imgfile in $imgfiles) {
	$imgfilename = "c:\FolderWhereUserProfilePicturesAreStored" + $imgfile.Name
	[Microsoft.SharePoint.SPFile]$file = UploadSPFile -url ([string][string]"http://mysitehost.ca/") -libraryName "User Photos" -filePath $imgfilename

	# Our filenames were in the format "fname lname-loginname.jpg"
	# Derive the loginname to get the user profile.
	$e1 = $imgfile.Name.split("-")
	$e2 = $e1[1].split(".")
	$e3 = $e2[0]

	$loginname = "domainname\" + $e3.trim(" ")

	$up = $upm.GetUserProfile($loginname);

	$picturePropertyName = GetProfilePropertyName -UserProfileManager $upm -PropertyName "PictureUrl";

	if (-not [System.String]::IsNullOrEmpty($picturePropertyName))
	{
	$PortraitUrl = CombineUrls -baseUrl $file.Web.Url -relU rl $file.ServerRelativeUrl;
	$up.get_Item($picturePropertyName).Value = $PortraitUrl
	$up.commit();
	}
}

Update-SPProfilePhotoStore –MySiteHostLocation "http://mysitehost.ca/"

