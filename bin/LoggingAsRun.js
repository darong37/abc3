// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// Main

//  指定パラメータ パス情報を取得
var args = WScript.Arguments;
var target = args(0);

var cmd = loggingAsGetCmd(target);

var shell = new ActiveXObject("WScript.Shell");
clip(target);
shell.Run(cmd,3);
