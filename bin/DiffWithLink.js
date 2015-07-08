// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// Main

//  指定パラメータ パス情報を取得
var args = WScript.Arguments;
var target = args(0);

var parent = dirname( target );

var pathS = pathchk(target);
if ( pathS[0] == 0 && pathS[1] != parent ){
  var cmd = "cmd.exe /c \"%EYOS_APPS%\\WinMerge\\WinMergeU.exe\" "+parent+" "+pathS[1];
  //shell.Popup(cmd, 0, "command line", 1);
  shell.Run(cmd);
} else if ( pathS[0] == 1 ){
  var name = basename(pathS[1],"name");
  var type = basename(pathS[1],"type");
  var first = parent+"\\BOD_"+name+"."+type;
  var local = parent+"\\_ローカル_"+name+"."+type;
  var cmd = "cmd.exe /c \"%EYOS_APPS%\\WinMerge\\WinMergeU.exe\" "+first+" "+pathS[1]+" "+local;
  //shell.Popup(cmd, 0, "command line", 1);
  shell.Run(cmd);
}
