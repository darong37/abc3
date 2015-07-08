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
var cur   = pathS[1];
if ( pathS[0] == 1 ){
  var name = basename(pathS[1],"name");
  var type = basename(pathS[1],"type");
  var local = parent+"\\_ローカル_"+name+"."+type;
  var roll  = parent+"\\ROL"+now()+"_"+name+"."+type);

  fso.CopyFile(cur, roll);
  fso.CopyFile(local, cur);

  explorer(cur);
  clip(cur);
}
