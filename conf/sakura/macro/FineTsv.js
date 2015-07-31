// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//
function fixLeft(target,len){
  var rtn = target;
  while( fixLen(rtn) < len ){
    rtn += ' ';
  }
  return rtn;
}
function fixLen(str){
  var len=0;
  for(var i=0;i<str.length;i++){
    var code=str.charCodeAt(i);
    if(code>255) len++;
    len++
  }
  return len;
}

//// 処理 ////
var LS;
switch (GetLineCode) {
case 0:
  LS = "\r\n";
  break;
case 1:
  LS = "\r";
  break;
case 2:
  LS = "\n";
  break;
default:
  LS = "\r\n";
  break;
}
//var FS = / *\t/;                                // jscript split のバグのため
                                                  // 正規表現だと空要素が消えてしまう。

var FS = "\t";                                    // jscript split のバグのため

if ( IsTextSelected == 0 ) {
  Editor.SelectAll(); 
}
var target = Editor.GetSelectedString(0);         // 選択部分の文字列を取得

var fldSizeS = new Array();

var lineS = target.split( LS,-1 );
for ( var i=0; i<lineS.length; i++ ){
  var line = lineS[i];
  // Debug:   Editor.MessageBox("Line :'"+line+"'");
  if ( ( /^#/.test(line) || /^\s*$/.test(line) || line == "" ) && ( ! /^#\@/.test(line) ) ){
    // No operation
  } else {
    var fldS = line.split( FS,-1 );
    for ( var ii=0; ii<fldS.length; ii++ ){
      var fld = fldS[ii];
      fld = fld.replace(/ +$/,"");                // jscript split のバグのため
      
      if ( fld != "#@" ) {
        if ( fldSizeS[ii] === undefined ) fldSizeS[ii] = 0;
    //  Editor.MessageBox("Compare fldSizeS["+ii+"]("+fldSizeS[ii]+")  with fixLen(fld)("+fixLen(fld)+")" );
        if ( fldSizeS[ii] < fixLen(fld) ){
           fldSizeS[ii] = fixLen(fld);
        }
      }
    }
  }
}

var result = "";
for ( var i=0; i<lineS.length; i++ ){
  var line = lineS[i];
  if ( ( /^#/.test(line) || /^\s*$/.test(line) || line == "" ) && ( ! /^#\@/.test(line) ) ){
    result += line;
  } else {
    var fldS = line.split( FS,-1 );
    for ( var ii=0; ii<fldS.length; ii++ ){
      var fld = fldS[ii];
      fld = fld.replace(/ +$/,"");                // jscript split のバグのため
      
      if ( ii != 0 ) result += "\t";
      result += fixLeft(fld,fldSizeS[ii]);
    }
  }
  if ( i+1 < lineS.length) result += LS;
}

Editor.InsText(result);
