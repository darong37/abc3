#!/bin/ksh
# DESC : CSVファイルをTARで固めてFTP転送する
#
# Usage: 11_a_csvfiles_put.ksh  [{サーバー名}]  [{指定県域}]
#
# Ex.  : ksh 11_a_csvfiles_put.ksh  dbnode01
#
# More Info. : head -25 11_a_csvfiles_put.ksh
#
#
PACKAGE='11_a_csvfiles_put'
VERSION='1.00'
SHELLTYPE='ksh'

##
## Args
##
OPT_FORCEFTP=0
if [[ $1 = '-f' ]];then
  OPT_FORCEFTP=1
  shift
fi
ARG_SERVER=${1-`uname -n`}
ARG_KENIKI=$2


##
## Base
##
APPLNAM=$( basename ${0#-} .$SHELLTYPE )
BASEDIR=$( cd `dirname ${0#-}`;pwd )
CONFDIR=$BASEDIR/tools/conf
Dying () { 
  echo "#! $@"
  [[ $PS1 = "" ]] && exit 1
  return 1
}


##
## Config/Const
##
typeset STIME=$( date '+%Y/%m/%d %H:%M:%S' )

[ -r $BASEDIR/$PACKAGE/$PACKAGE.conf ]  || Dying "Fail to include $BASEDIR/$PACKAGE/$PACKAGE.conf"
. $BASEDIR/$PACKAGE/$PACKAGE.conf

export IKOU_TOOLS=$BASEDIR/tools
[ -r $CONFDIR/env.conf ]                || Dying "Fail to include $CONFDIR/env.conf"
. $CONFDIR/env.conf


##
## Dirs
##
[[ $IKOU_TMP = $BASEDIR/* ]]            || Dying "Invalid path $IKOU_TMP"
TMPDIR=$IKOU_TMP/${APPLNAM}_$$
[ -d $TMPDIR ] && rm -fr $TMPDIR
mkdir -p $TMPDIR

[[ $IKOU_WK = $BASEDIR/* ]]             || Dying "Invalid path $IKOU_WK"
TARDIR=$IKOU_WK/csvfiles
mkdir -p $TARDIR

[[ $IKOU_LOG = $BASEDIR/* ]]            || Dying "Invalid path $IKOU_LOG"
LOGDIR=$IKOU_LOG

echo "# Dirs"
echo "# TMPDIR: $TMPDIR"
echo "# TARDIR: $TARDIR"
echo "# LOGDIR: $LOGDIR"
echo


##
## Exit/Err Handle
##
ExitHandle () {
  local rtn=$1
# [ -d $TMPDIR ] && rm -fr $TMPDIR
  
  if (( $rtn == 0 ));then
    echo "# 正常終了"
  else
    echo "# 異常終了($rtn)"
  fi
}
trap 'ExitHandle $?;exit' EXIT

ErrHandle () {
  local rtn=$1
  local lin=$2

  trap '' EXIT
  Dying "# line: $lin: Error occured($rtn)"
}
trap 'ErrHandle $? $LINENO' ERR


##
## Files
##
PRMORG=$BASEDIR/$APPLNAM.info
PRMFILE=$TMPDIR/$APPLNAM.prm
cat $PRMORG                   |
egrep -v '^#'                 |
sed 's/ *\t */\t/g'           |
sed 's/\r$//'                 |
egrep -v '^\s*$'              |
egrep "^	${ARG_SERVER}	" > $PRMFILE
pipestatus "${PIPESTATUS[@]}"

LOGFILE=$LOGDIR/$APPLNAM.log

FTPRST0=$TMPDIR/$APPLNAM.ftprst0
FTPRST1=$TMPDIR/$APPLNAM.ftprst1

echo "# Files"
echo "# PRMORG:  $PRMORG"
echo "# PRMFILE: $PRMFILE"
echo "# LOGFILE: $LOGFILE"
echo "# FTPRST0: $FTPRST0"
echo "# FTPRST1: $FTPRST1"
echo

##
## Main
##
typeset -i rtn=-1
{
  echo "## -------------------------------------------------------------------"
  echo "##  サーバ名    県域     圧縮ファイル名        処理結果（全県域）"
  echo "## -------------------------------------------------------------------"

  typeset -i no=0
  typeset -i ok=0
  typeset -i ng=0
  while read	server	keniki	kanji	sendHost	sendTo	ftpuser	ftppass	ftprdir
  do
    [[ $ARG_KENIKI != "" ]] && [[ $ARG_KENIKI != $keniki ]] && continue
    no=$no+1
    
    tarNam="csvfiles_$keniki"
    echo "#"
    echo "# 県域： $kanji"
    echo "#"
    ###
    ### アーカイブファイルの作成
    ###
    sh $BASEDIR/$PACKAGE/target_csvfiles.ksh  $keniki
    rtn0=$?
    if (( $rtn0 != 0 )) && [[ $OPT_FORCEFTP = '0' ]];then
      echo "#! アーカイブファイルの作成が異常のため、FTPを行いません"
      continue
    fi
    
    ###
    ### アーカイブファイルのFTP転送
    ###

    #### FTP送信先ホストが設定されていなかったら、FTPを行わない
    if [ "${sendTo}" = "" ]; then
      echo "#! FTP送信先ホストが未設定のため、FTPを行いません"
      continue
    fi
    
    #### 転送アーカイブファイルがないので、FTPを行わない
    if [ ! -e $TARDIR/${tarNam}.tar.Z ] || [ ! -e $TARDIR/${tarNam}.end ]; then
      echo "#! 転送アーカイブファイルがないので、FTPを行いません"
      continue
    fi
    
    echo "# open:${sendTo}, user:${ftpuser}, rdir:${ftprdir}, put:${tarNam}.tar.Z"
    cd $TARDIR
      ftp -niv <<-FTP > $FTPRST0
		open ${sendTo}
		user ${ftpuser} ${ftppass}
		binary
		cd ${ftprdir}
		pwd
		put ${tarNam}.tar.Z
		put ${tarNam}.end
		bye
	FTP
    cd -
    
    ###
    ### FTP結果の評価
    ###
    cat $FTPRST0
    grep -v "bytes sent in"  $FTPRST0 > $FTPRST1
    ftpResult=$( awk '/^[45][0-9][0-9]|Not connected/ { print }' $FTPRST1 )
    if [ "${ftpResult}" != "" ]; then
      echo "# NG ${tarNam}.tar.Z の移送に失敗しました  FTPエラー: ${ftpResult}"
      ng=$ng+1
    else
      echo "# OK ${tarNam}.tar.Z の移送に成功しました。"
      ftpResult="送信済み"
      ok=$ok+1
    fi
    echo "## ${server}    ${keniki}    ${tarNam}.tar.Z  ${ftpResult}"
  done < $PRMFILE

##
## Final
##
  echo "## "
  echo "## Result  Total: $no  OK: $ok  NG: $ng"
  echo "## 開始時間： $STIME"
  echo "## 終了時間： $( date '+%Y/%m/%d %H:%M:%S' )"
  echo "## "
  if (( $no > 0 )) && (( $ng == 0 ));then
    rm -fr $TMPDIR
    rtn=0
  elif (( $ng > 0 ));then
    rtn=ng
  fi

  exit $rtn
} 2>&1 | tee $LOGFILE | perl -nle 'if ( /^#[#\!] / ){ s/^#[#\!] //;print }'
