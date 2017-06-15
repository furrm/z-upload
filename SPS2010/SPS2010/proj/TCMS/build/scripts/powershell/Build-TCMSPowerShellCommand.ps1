$TCMSScriptLocation = "D:\TCMSDeployment\proj\TCMS\MAIN\build\scripts\powershell"

Set-Location $TCMSScriptLocation

$ScriptWorkingDirectory = "D:\TCMSDeployment\common\MAIN\build\scripts\powershell\FarmInstall"

$TCMSScriptWorkingDirectory = "D:\TCMSDeployment\proj\TCMS\MAIN\build\scripts\powershell"

$SolutionFilesDirectory = "D:\TCMSDeployment\proj\TCMS\MAIN\build\solutuionFiles"

#RETRACT
.\Build-TCMS.ps1 -ScriptWorkingDirectory $ScriptWorkingDirectory -TCMSScriptWorkingDirectory $TCMSScriptWorkingDirectory -SolutionFilesDirectory  $SolutionFilesDirectory -SolutionManifestFileName SolutionManifest.xml -BuildCommand "Retract"

#BUILD
.\Build-TCMS.ps1 -ScriptWorkingDirectory $ScriptWorkingDirectory -TCMSScriptWorkingDirectory $TCMSScriptWorkingDirectory -SolutionFilesDirectory  $SolutionFilesDirectory -SolutionManifestFileName SolutionManifest.xml -BuildCommand "Build"

#SEED DATA
.\Build-TCMS.ps1 -ScriptWorkingDirectory $ScriptWorkingDirectory -TCMSScriptWorkingDirectory $TCMSScriptWorkingDirectory -SolutionFilesDirectory  $SolutionFilesDirectory -SolutionManifestFileName SolutionManifest.xml -BuildCommand "SeedData"

