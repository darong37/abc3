
var shell = new ActiveXObject("WScript.Shell");

//スクリプト名を含まないフルパスを編集する
var base = WScript.ScriptFullName;
var name = WScript.ScriptName;

base = base.replace(name,"");
base = base.replace("\\conf\\","");
//shell.Popup(base, 0, "BASE", 1);

//環境変数へアクセスする
var env = shell.Environment('VOLATILE');  //ログインの環境変数
//var env = shell.Environment('USER');    //ユーザーの環境変数

//環境変数の読み込み
//DESKTOP読み込み
//var dt = env.item("DESKTOP");
//shell.Popup("%DESKTOP%", 0, "DESKTOP", 1);

//環境変数の書き込み
//設定
env.item("EYOS")       = base;
env.item("EYOS_APPS")  = base + "\\apps" ;
env.item("EYOS_BIN")   = base + "\\bin"  ;
env.item("EYOS_CONF")  = base + "\\conf" ;
env.item("EYOS_DAILY") = base + "\\daily";
env.item("EYOS_EACH")  = base + "\\each" ;
//env.item("EYOS_WKSP")  = base + "\\wksp" ;


//機能設定
env.item("EYOS_F_EDITOR") = base + "\\apps\\SakuraDown12f-17_forv2\\sakura.exe" ;


//作業フォルダ作成
var date = new Date();

y = date.getFullYear();
m = date.getMonth() + 1;
d = date.getDate();
m = ('0' + m).slice(-2);
d = ('0' + d).slice(-2);

var wkdr = base + "\\daily\\" + y + m + d;
var fso = new ActiveXObject( "Scripting.FileSystemObject" );
if ( ! fso.FolderExists(wkdr) ) fso.CreateFolder(wkdr);

env.item("EYOS_TODAY") = wkdr;
//
