$p = Split-Path $myInvocation.MyCommand.path
echo $p

Get-Content $p\hoge.txt | Select-String -Pattern  "^[-\t]+$" -notmatch | Set-Content $p\fuga.txt 