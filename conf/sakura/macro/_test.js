// FUNCS
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );
//

//// サンプルコード ////
// 表示系
//   表示ボタン
//      0 OK 
//      1 OK／キャンセル 
//      2 中止／再試行／無視 
//      3 はい／いいえ／キャンセル 
//      4 はい／いいえ 
//      5 再試行／キャンセル 
//      6 キャンセル／再実行／続行 
//   戻り値
//      1 OK 
//      2 キャンセル 
//      3 中止 
//      4 再試行 
//      5 無視 
//      6 はい 
//      7 いいえ 
//     10 再実行 
//     11 続行 
//
//   Editor.MessageBox("message");
//   Editor.MessageBox("message",buttom);
//   Editor.InputBox("message");                            // 戻り値: 入力文字列
//   Editor.InputBox("message","default",limitStringSize);  // 戻り値: 入力文字列
//   Editor.StatusMsg("status", 0 );
//   Editor.ErrorMsg( "message" );
//   Editor.WarnMsg( "message" );
//   Editor.InfoMsg( "message" );
//   Editor.OkCancelBox( "message" );                       // 戻り値: 1, 2
//   Editor.YesNoBox( "message" );                          // 戻り値: 6, 7
//
//   Editor.FileOpenDialog( fln, extend );
//   Editor.FolderDialog( msg, fld );
//   shell.BrowseForFolder(0, "通常", 0, fld);
//
//   参考 shell.Popup("message", 0, "title", 1);
//   
//   Editor.GetFilename();               // Sakura編集中のファイル名
//   Editor.ExpandParameter("$M");       // 実行中のマクロのフルパスを返す
//   Editor.GetClipboard(0);             // クリップボードの文字列を返す
//   Editor.SetClipboard(0,string);      // クリップボードに文字列を設定
//   Editor.GetSelectedString(0);        // 選択されている文字列を返す
//   Editor.GetLineStr(0);               // 改行コードを含む1行の文字列  0はカレント行
//
//   Editor.FileOpen ( fln );            // ファイルをsakuraで開く 
//   fso.CopyFile(src, dest);            // ファイルのコピー
//
//   ExecCommand(cmd,0);                                              // 外部コマンドの実行
//   shell.Run("cmd.exe /c \"%EYOS_APPS%\\ .exe \" "+args,0);         // 外部コマンドの実行
//   shell.ExpandEnvironmentStrings("%EYOS_CONF%\\");                 // 環境変数の取得
//
//   Editor.ReplaceAll(regex, txt, 28);  // すべて置換    （reg） (サブ) (英大小)

//
//   if ( IsTextSelected != 0 ) {
//     cmd = Editor.GetSelectedString(0);
//   } else {
//     cmd = Editor.GetClipboard(0);
//   }
//

//// テスト
//T   Editor.MessageBox(dirname(shell.ExpandEnvironmentStrings("%EYOS_CONF%\\a.a")));
//
//   var msg = getHereDoc("Test0");
/* Test0
abc
hoge
fuga piyo
*/
//   Editor.MessageBox(msg);
////


//// 処理 ////
//ls
//ls();
//
//ls C:/Users/eyos/Desktop/eyos/daily/**  ""  all
//ls("C:/Users/eyos/Desktop/eyos/daily/**","","all");
//
//ls C:\Users\eyos\Desktop\eyos\each ""
//ls("C:\\Users\\eyos\\Desktop\\eyos\\each");
//
//var target = 'a "b c" d   dd	f "" g "gg  \\" h " ij ';
var target = 'ls C:\Users\eyos\Desktop\eyos\each "" "g \\" h"';
  var prmS = cmdline(target);
  var cmd = prmS.shift();
  cmd += '(';
  for( var i in prmS ){
    var prm = prmS[i];
    if ( i>0 ) cmd += ',';
    cmd += prm;
  }
  cmd += ');';
  stat("Comline: "+ cmd);
//
//



