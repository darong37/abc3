// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// 処理 ////
var env = shell.Environment('VOLATILE');  //ログインの環境変数
var daily = getEnv("%EYOS_DAILY%");
var each = getEnv("%EYOS_EACH%");         // 環境変数の取得

var name = Editor.FolderDialog( "作業を選択してください", each );
if ( name == "" ){
  name = Editor.InputBox("新規作業名を入力してください","");  // 戻り値: 入力文字列
  if ( name != "" ) fso.CreateFolder(each+"\\"+name);
} else {
  name = basename(name);
}
Editor.StatusMsg(name, 0 );

if (name != ""){
  //環境変数へアクセスする
  var path = shell.ExpandEnvironmentStrings("%EYOS_TODAY%\\"+name);

  var lnk = shell.CreateShortcut(path+".lnk");
  lnk.TargetPath = each+"\\"+name;
  lnk.Save();

  Editor.FileOpen( path+".txt" );
}
