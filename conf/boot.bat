@echo off

rem
rem 説明
rem

rem 設定
set HOGE="変数の値"

rem %~1         - すべての引用句 (") を削除して、%1 を展開します。
rem %~f1        - %1 を完全修飾パス名に展開します。
rem %~d1        - %1 をドライブ文字だけに展開します。
rem %~p1        - %1 をパスだけに展開します。
rem %~n1        - %1 をファイル名だけに展開します。
rem %~x1        - %1 をファイル拡張子だけに展開します。
rem %~s1        - 展開されたパスは、短い名前だけを含みます。
rem %~a1        - %1 をファイル属性に展開します。
rem %~t1        - %1 をファイルの日付/時刻に展開します。
rem %~z1        - %1 をファイルのサイズに展開します。
rem %~$PATH:1   - PATH 環境変数に指定されているディレクトリを検索し、
rem                最初に見つかった完全修飾名に %1 を展開します。
rem                環境変数名が定義されていない場合、または
rem                検索してもファイルが見つからなかった場合は、
rem                この修飾子を指定すると空の文字列に展開されます。
rem このバッチが存在するフォルダをカレントに
pushd %0\..
cls


rem 処理
set ShellFolders=HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders
FOR /F "TOKENS=1,2,*" %%I IN ('REG QUERY "%ShellFolders%" /v "Desktop"') DO IF "%%I"=="Desktop" SET RESULT=%%K
setx "DESKTOP" "%RESULT%"
cscript.exe //nologo /e:jscript "%RESULT%\eyos\conf\conf.js"

rem pause
exit
