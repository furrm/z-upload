Get-SpSolution | forEach-Object {
$_.SolutionFile.SaveAs("D:\GSP\SolutionBackUps\$($_.Name)")}