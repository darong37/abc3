//// FUNCS ////
var funcs = GetObject("Script:C:\\Users\\eyos\\Desktop\\eyos\\bin\\_FUNCS.wsc");
eval( funcs.get() );

//// 処理 ////
MinimizeAll ( );
Editor.Sleep( 200 );

// 画面キャプチャ(Excelが必要)
excel.ExecuteExcel4Macro( "CALL(\"user32\",\"keybd_event\",\"JJJJJ\",44,121,1,0)" );
excel.ExecuteExcel4Macro( "CALL(\"user32\",\"keybd_event\",\"JJJJJ\",44,121,3,0)" );

// 現在アクティブなウィンドウを最小化
// 
//   ※エクスプローラ上でこのスクリプトを
//     ダブルクリック等により起動した場合，
//     単にペイントをAppActivateするだけだと，
//     エクスプローラがアクティブなままになる。
//     ペイントをアクティブにするためには，このように最小化して
//     エクスプローラからフォーカスを外す。
//

var fn = Editor.GetFilename();
var bmpname = dirname(fn) + "\\" + basename(fn,"name") + "_" + today() + "_" + now() + ".bmp";
Editor.StatusMsg(bmpname, 0 );



// 空画像を作成
var out = new ActiveXObject("ADODB.Stream");
out.Type = 1; // バイナリモードで書き込み
out.Open();
out.SaveToFile( bmpname, 2 ); // 上書き保存
out.Close();


// MSペイントを起動・最大化 http://msdn.microsoft.com/ja-jp/library/cc364421.aspx
var mspaint = shell.Run("mspaint.exe " + bmpname, 3);
//var mspaint = shell.Run("mspaint.exe " + bmpname, 0);
Editor.Sleep( 1000 );
var ret = shell.AppActivate( mspaint );

// 画像を保存
Editor.Sleep( 200 );
shell.SendKeys( "^v" );    // ペースト
Editor.Sleep( 200 );
shell.SendKeys( "^s" );    // 保存


Editor.SetClipboard(0,bmpname);      // クリップボードに文字列を設定

Editor.InsText(bmpname);
// さっき最小化したアプリケーションを復元
//shell.SendKeys( "%+{TAB}" );
