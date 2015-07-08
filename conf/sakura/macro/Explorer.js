// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// 処理 ////
var target;
if ( IsTextSelected == 0 ) {
  target = Editor.GetFilename();
} else {
  target = Editor.GetSelectedString(0);
  target = target.replace(/^\s*/,'');
  target = target.replace(/\r?\n$/,'');
}
Editor.StatusMsg(target, 0 );

//Editor.ExecCommand('Explorer.exe /select,"'+target+'"');
explorer(target);

