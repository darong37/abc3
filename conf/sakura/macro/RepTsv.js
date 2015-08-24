// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// 処理 ////
if ( IsTextSelected == 0 ) {
  Editor.SelectAll(); 
}
//var target = Editor.GetSelectedString(0);         // 選択部分の文字列を取得

Editor.ReplaceAll( ' +' , '\t' , 148 );
