// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// Main

//  指定パラメータ パス情報を取得
var args = WScript.Arguments;
var target = args(0);

var name  = basename(target,"name")
var type  = basename(target,"type")
var fold  = shell.ExpandEnvironmentStrings("%EYOS_TODAY%\\"+name);
var down  = fold+"\\_ローカル_"+name+"."+type;
var back  = fold+"\\BOD"+now()+"_"+name+"."+type;
var back2 = fold+"\\REV"+now()+"_"+name+"."+type;

if ( dexist(fold) ){
  shell.Popup(fold+" は本日のバックアップが存在します。", 0, "ワークスペース", 1);
  fso.CopyFile(target, back2);
} else {
  fso.CreateFolder(fold);

  fso.CopyFile(target, down);
  fso.CopyFile(target, back);
  
  var link  = fold+"\\_リンク_"+name+".lnk";
  var shortcut = shell.CreateShortcut(link);
  shortcut.TargetPath = target;
  shortcut.Save();
}

logging("back",target);

explorer(down);
clip(down);

