# PowerShell script to create a desktop shortcut for Eker AI Control Center
$WshShell = New-Object -ComObject WScript.Shell
$ShortcutPath = "$env:USERPROFILE\Desktop\Eker AI Control Center.lnk"
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
# adjust the target path to point to your node executable or a batch file that starts the app
$Shortcut.TargetPath = "C:\Program Files\nodejs\node.exe"
# if you have a start script or npm command, you could point to a batch file
$Shortcut.Arguments = "f:\Aiagent\backend\src\index.js"
$Shortcut.WorkingDirectory = "f:\Aiagent\backend"
$Shortcut.WindowStyle = 1
$Shortcut.IconLocation = "C:\Program Files\nodejs\node.exe, 0"
$Shortcut.Save()
Write-Output "Shortcut created at $ShortcutPath"