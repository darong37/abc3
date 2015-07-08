//// オブジェクト ////
var excel = new ActiveXObject("Excel.Application");
var shell = new ActiveXObject("WScript.Shell");
var fso   = new ActiveXObject("Scripting.FileSystemObject");

//// Function ////
//コレクションを配列に変換
function collectionToArray(collection){
  var objEnu = new Enumerator(collection);
  var array = [];
  for (; !objEnu.atEnd(); objEnu.moveNext() ){
    array.push(objEnu.item());
  }
  return array;
}

function pathconv(path){
  return path.replace(/\//g,"\\");
}

//

//コマンド
function cmdline(target){
  var ptn = getLoopTenkai('"');
  var regex = new RegExp(ptn,"g");

  var eleS = target.split(regex);
  var dlmS = target.match(regex);
  dlmS = dlmS || [];

  var target2 = '';
  for ( var i0 in eleS ){
    var ele = eleS[i0];
    
    if ( i0 > 0 ){
      target2 += ' @'+i0+' ';
    }
    target2 += ele;
  }

  eleS = target2.split(/\s+/);
  var rtnS = [];
  for ( var i0 in eleS ){
    var ele = eleS[i0];
    
    if( i0 > 0 ){
      if ( /^@[0-9]+$/.test(ele) ){
        var i = ele.replace(/^@/,'') - 1;
        ele = dlmS[i];
      }
      
      ele = ele.replace(/\\/g,"\\\\");
      if ( ! /^["'].*["']$/.test(ele) ){
        ele = '"' + ele + '"';
      }
    }
    rtnS.push(ele);
  }
  return rtnS;
}

//
//  "						# delimiter
//  	(
//  		(
//  			[^"]*		# general pattern
//  			(\\")*		# special pattern
//  		)*
//  		[^\\]			# except esc
//  	)?
//  "						# delimiter
//
function getLoopTenkai(dlm, esc, gen){
  esc = esc || '\\\\';
  gen = gen || '[^'+dlm+']*';

  var genptn = '[^' + dlm + ']*';
  var spcptn = '('  + esc + dlm + ')*';
  
  var escptn = '[^' + esc + ']';
  
  var ptn = '(' + genptn + spcptn + ')*';
  ptn = '(' + ptn + escptn + ')?';
  ptn = '"' + ptn + '"';
  
  return ptn;
}
//

function msg(str){
  if ( str == null ) str = "";
  Editor.MessageBox(str);
}

function stat(str){
  if ( str == null ) str = "";
  Editor.StatusMsg(str);
}

function echo(str){
  if ( str == null ) str = "";
  Editor.InsText(str+"\r\n");
}

function pwd(){
  Editor.InsText(dirname()+"\r\n");
}

function cat(path){
    path = pathconv(path);

    var text = fread(path);
    Editor.InsText(text);
}

function ls(path,nmMask,type){
  path   = path   || dirname();
  nmMask = nmMask || ".*";
  type   = type   || "all";   // file | folder | all

  path = pathconv(path);
  var subfld = false;
  if ( basename(path) == "**" ) {
    path = dirname(path);
    subfld = true;
  }
  var regex = new RegExp(nmMask, "m");

  root = new ActiveXObject( "Scripting.FileSystemObject" ).getFolder(path);

  var fileS = getContents(root,subfld,type);

  Editor.AddRefUndoBuffer();
  for(var i in fileS) {
    if ( regex.test(fileS[i].Name) ){
      Editor.InsText(fileS[i].Path +"\r\n");
    }
  }
  Editor.SetUndoBuffer();
  Editor.StatusMsg(path, 0 );
}

function explorer(target){
  var rtnS = pathchk(target);
  var r = 1;
  while(rtnS[0] < 0 && r == 1){
    r = popupBox("Not found "+target);
    target = dirname(target);
    if (r != 1) clip(target);

    rtnS = pathchk(target);
  }
  new ActiveXObject("WScript.Shell").Run('Explorer.exe /select,"'+target+'"', 1);
}

//サブフォルダ一覧を取得
function getContents(fld,subfld,type){
  // ファイル
  rtnS = collectionToArray(fld.Files);
  
  var sfldS = collectionToArray(fld.SubFolders);
  for( var i in sfldS ) {
    if ( /(folder|all)/.test(type) ) rtnS = rtnS.concat( sfldS[i] );
    // サブフォルダ
    if (subfld) {
      if ( /(file|all)/.test(type) ) rtnS = rtnS.concat( getContents(sfldS[i]) );
    }
  }
  return rtnS;
}

function today(dd,dlm) {
  dd  = dd  || 0;
  dlm = dlm || "";

  var date = new Date();


  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();

  // 補正
  if ( dd != 0 ){
    m += -1;
    d += dd;
    date = new Date(y,m,d);
    
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
  }

  m = ('0' + m).slice(-2);
  d = ('0' + d).slice(-2);

  return y + dlm +  m + dlm + d;
}

function now(dlm) {
  dlm = dlm || "";

  var date = new Date();

  var H = date.getHours();
  var M = date.getMinutes();
  var S = date.getSeconds();

  H = ('0' + H).slice(-2);
  M = ('0' + M).slice(-2);
  S = ('0' + S).slice(-2);

  return H + dlm + M + dlm + S;
}

function basename(path,opt) {
  path = path || Editor.GetFilename();
  opt  = opt  || "full"
  
  var rtn = path.replace( /.*\\/, '' );
  if ( opt == "name" ){
    rtn = rtn.replace( /\.[^.]*$/,'' );
  } else if( opt == "type" ){
    rtn = rtn.replace( /^.*\./,'' );
  }
  return rtn;
}
//T Editor.MessageBox(basename("C:\\dir1\\dir2\\name.type"));
//T Editor.MessageBox(basename("name.type"));
//T Editor.MessageBox(basename("C:\\dir1\\dir2\\name.type","name"));
//T Editor.MessageBox(basename("C:\\dir1\\dir2\\name.type","type"));
//T Editor.MessageBox(basename("C:\\dir1\\dir2\\name.mid.type","name"));
//T Editor.MessageBox(basename("C:\\dir1\\dir2\\name.mid.type","type"));


function dirname(path) {
  path = path || Editor.GetFilename();
  return path.replace(/\\[^\\]*$/, '');
}

function getHereDoc(name) {
  var self = Editor.ExpandParameter("$M");       // 実行中のマクロのフルパスを返す
  var text = "";

  var fso = new ActiveXObject("Scripting.FileSystemObject");
  var f = fso.OpenTextFile(self);
  text = f.ReadAll();
  f.Close();
  f = null;
  fso = null;

//var regex = new RegExp("^\\s*/\\*\\s*" + name + "[ \\f\\r\\t\\v]*\\n((.|\\s)*?)(?=\\n[ \\f\\r\\t\\v]*\\*/)", "m");
  var regex = new RegExp("^/?/?\\s*/\\*\\s*" + name + "[ \\f\\t\\v]*\\r?\\n((.|\\s)*?)(?=\\r?\\n/?/?[ \\f\\t\\v]*\\*/)", "m");
  var rtn;
  if(regex.test(text)) {
    rtn = RegExp.$1;
  //rtn = rtn.replace(/^[ \\f\\r\\t\\v]*/gm, "");
  }
  return rtn;
}

function clip(str){
  new ActiveXObject("WScript.Shell").Run("cmd /c \"echo " + str + "| clip\"", 0);
}
//T clip("A B C");

function fread(fln) {
  //  オープンモード
  var FORREADING      = 1;    // 読み取り専用
  var FORWRITING      = 2;    // 書き込み専用
  var FORAPPENDING    = 8;    // 追加書き込み

  //  開くファイルの形式
  var TRISTATE_TRUE       = -1;   // Unicode
  var TRISTATE_FALSE      =  0;   // ASCII
  var TRISTATE_USEDEFAULT = -2;   // システムデフォルト

  //  ファイル関連の操作を提供するオブジェクトを取得
  var fso = new ActiveXObject( "Scripting.FileSystemObject" );

  //  ファイルを読み取り専用で開く
  var file = fso.OpenTextFile( fln );
  var text = file.ReadAll();
  file.Close();
  file = null;
  fso  = null;

  return text;
}

function fwrite(fln,append,str) {
  //  オープンモード
  var FORREADING      = 1;    // 読み取り専用
  var FORWRITING      = 2;    // 書き込み専用
  var FORAPPENDING    = 8;    // 追加書き込み

  //  開くファイルの形式
  var TRISTATE_TRUE       = -1;   // Unicode
  var TRISTATE_FALSE      =  0;   // ASCII
  var TRISTATE_USEDEFAULT = -2;   // システムデフォルト

  //  ファイル関連の操作を提供するオブジェクトを取得
  var fso = new ActiveXObject( "Scripting.FileSystemObject" );

  //  ファイルを書き込み専用で開く
  var file;
  if ( append == 0 ){
    file = fso.OpenTextFile( fln, FORWRITING, true, TRISTATE_FALSE );
  } else {
    file = fso.OpenTextFile( fln, FORAPPENDING, true, TRISTATE_FALSE );
  }

  //  文字列を書き込む(改行なし)
  file.Write( str );

  //  ブランク行を二行書き込む
  file.WriteBlankLines( 1 );

  //  ファイルを閉じる
  file.Close();
  
  file = null;
  fso = null;
}

function fexist(fln) {
  return new ActiveXObject( "Scripting.FileSystemObject" ).FileExists(fln);
}

function dexist(drn) {
  return new ActiveXObject( "Scripting.FileSystemObject" ).FolderExists(drn);
}

function getEnv(txt){
  return new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings(txt);
}

function linkchk(path,dflt) {
  var rtn = "";
  dflt = dflt || "";

  if ( basename(path,"type") == 'lnk' ){
    lnk = 1;
    if ( fexist(path) ){
      var sc = shell.CreateShortcut(path);
      rtn = sc.TargetPath;
    } else {
      rtn = dflt;
    }
  } else {
    rtn = path;
  }
  return rtn
}

function pathchk(path) {
  // 0  : Folder
  // 1  : File
  // -1 : No Exist
  // -2 : Dead Link

  //  ファイル関連の操作を提供するオブジェクトを取得

  var rtn;
  var target = linkchk( path,path );
  if ( dexist(target) ) {
    rtn = 0;
  } else if ( fexist(target) ){
    rtn = 1;
  } else {
    if ( target == path ) {
      rtn = -1
    } else {
      rtn = -2;
    }
  }
  return [ rtn,target ];
}

//
// loggingAsGetCmd
//
function popupBox(msg,title){
  return new ActiveXObject("WScript.Shell").Popup(msg, 0, title, 1);
}

function logging(lbl,msg){
  var logf = getEnv("%EYOS_DAILY%\\open.log");
  fwrite(logf,true,today()+"  "+now()+"\t"+lbl+"\t"+msg);
}

function loggingAsGetCmd(target){
  var edit = getEnv("%EYOS_F_EDITOR%");

  var pathS = pathchk(target);
  
  var lbl;
  var cmd;
  switch( pathS[0] ){
  case 0:
    lbl = "open"
    cmd = "Explorer.exe /select,\""+pathS[1]+"\"";
    break;
  case 1:
    var typ = basename(target,"type");
    if ( /xls.*/.test(typ) ){
      lbl   = "excel";
      cmd   = "excel.exe /e /r \""+pathS[1]+"\"";
    } else if ( /doc.*/.test(typ) ){
      lbl   = "word";
      cmd   = "Winword.exe \""+pathS[1]+"\"";
    } else if ( /ppt.*/.test(typ) ){
      lbl   = "power";
      cmd   = "POWERPNT.exe \""+pathS[1]+"\"";
    } else if ( typ == "txt" ){
      lbl   = "excel";
      cmd   = "excel.exe /e /r \""+pathS[1]+"\"";
    } else if ( typ == "log" ){
      lbl   = "edit";
      cmd   = edit + " \""+pathS[1]+"\"";
    } else {
      lbl   = "open";
      cmd   = "\""+pathS[1]+"\"";
    }
    break;
  default:
    lbl   = "error";
    if ( pathS[0] == -1 ){
      popupBox("Not Found "+pathS[1], "File Not Found");
    } else {
      popupBox("Dead Link "+pathS[1], "Dead Link");
    }
    
    var parent = dirname(pathS[1]);
    if ( dexist(dirname(parent)) ){
      cmd = "Explorer.exe /select,\""+parent+"\"";
    } else {
      cmd = "";
    }
  }

//  fwrite(logf,true,today()+"  "+now()+"\t"+lbl+"\t"+target);
  logging(lbl,target);
  
  return cmd;
}
// Todo Test
