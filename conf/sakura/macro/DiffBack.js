// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// 処理 ////
var fln = Editor.GetFilename();
//var dnm = dirname(fln);
var dnm = shell.ExpandEnvironmentStrings("%EYOS_TODAY%");
var bnm = basename(fln);

var ver = Editor.InputBox("バージョン(n+1世代前)を入力してください(n:0-9)",0,1);

var path;
if ( ver == "" ){
  path = FileOpenDialog(dnm+"\\_recycle\\"+bnm+".b00","*.*");
} else {
  path = dnm+"\\_recycle\\"+bnm+".b0"+ver;
}

if ( fexist(path) ){
  shell.Run("cmd.exe /c \"%EYOS_APPS%\\WinMerge\\WinMergeU.exe\" "+path+" "+fln,0);
} else {
  Editor.WarnMsg( "ファイル名 \""+path+"\" が見つかりません" );
}
