Set oShell = CreateObject ("Wscript.Shell") 
Dim strArgs
strArgs = "cmd /c C:\Users\jekar\Desktop\telegram_bot_jabko\start.bat"
oShell.Run strArgs, 0, false