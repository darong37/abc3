#!/bin/ksh
# DESC :
#
# Usage: target_csvfiles.ksh  {県域}
#
# Ex.  : ksh target_csvfiles.ksh  osaka
#
# More Info. : head -20 target_csvfiles.ksh
#
#
PACKAGE='11_a_csvfiles_put'
VERSION='1.00'
SHELLTYPE='ksh'

##
## Args
##
typeset KENIKI=${1:-osaka}


##
## Base
##
APPLNAM=$( basename ${0#-} .$SHELLTYPE )
BASEDIR=$( cd `dirname ${0#-}`/..;pwd )
CONFDIR=$BASEDIR/tools/conf
Dying () { 
  echo "#! $@"
  [[ $PS1 = "" ]] && exit 1
  return 1
}


##
## Config/Const
##
typeset TARNAM="csvfiles_$KENIKI"
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

ARCDIR=$TARDIR/$TARNAM
[ -d $ARCDIR ] && rm -fr $ARCDIR
mkdir -p $ARCDIR

echo "# Dirs"
echo "# TMPDIR: $TMPDIR"
echo "# TARDIR: $TARDIR"
echo "# ARCDIR: $ARCDIR"
echo


##
## Exit/Err Handle
##
ExitHandle () {
  local rtn=$1
# [ -d $TMPDIR ] && rm -fr $TMPDIR
  
  if (( $rtn == 0 ));then
    echo "# $APPLNAM 正常終了"
  else
    echo "# $APPLNAM 異常終了($rtn)"
  fi
}
trap 'ExitHandle $?;exit' EXIT

ErrHandle () {
  local rtn=$1
  local lin=$2

  trap '' EXIT
  Dying "#! line: $lin: Error occured($rtn)"
}
trap 'ErrHandle $? $LINENO' ERR


##
## Files
##
PRMORG=$BASEDIR/$PACKAGE/$APPLNAM.info
PRMFILE=$TMPDIR/$APPLNAM.prm
cat $PRMORG                |
egrep -v '^#'              |
sed 's/ *\t */\t/g'        |
sed 's/\r$//'              |
egrep -v '^\s*$'           |
sed "s/{keniki}/$KENIKI/g" > $PRMFILE
# pipestatus "${PIPESTATUS[@]}"

RESULTF=$TARDIR/$TARNAM.tar.Z
[ -e $RESULTF ] && rm -f $RESULTF

ENDFILE=$TARDIR/$TARNAM.end
[ -e $RESULTF ] && rm -f $ENDFILE
echo "# Files"
echo "# PRMORG:  $PRMORG"
echo "# PRMFILE: $PRMFILE"
echo "# RESULTF: $RESULTF"
echo "# ENDFILE: $ENDFILE"
echo


##
## Main
##
typeset -i no=0
typeset -i ok=0
typeset -i ng=0
while read	targetDir	targetFile	distDir
do
  no=$no+1
  [[ $targetDir = /*/ ]] && targetDir=${targetDir%/}
  [[ $distDir = /*/ ]]   && distDir=${distDir%/}
  arcName=$( echo ${distDir#/} | sed 's/\//\./g' )
  #
  if [ -e $targetDir/$targetFile ];then
    ( cd $targetDir ; ls -l $targetFile )     >> $ARCDIR/$KENIKI.ls
    ( cd $targetDir ; cksum $targetFile )     >> $ARCDIR/$KENIKI.cksum
    echo "$arcName.tar	$distDir"             >> $TMPDIR/$KENIKI.info
    if [ -e $ARCDIR/$arcName.tar ];then
      ( cd $targetDir ; tar cvf $ARCDIR/$arcName.tar $targetFile )
    else
      ( cd $targetDir ; tar rvf $ARCDIR/$arcName.tar $targetFile )
    fi
    echo "#  OK $targetDir/$targetFile"
    ok=$ok+1
  else
    echo "#  Not Found $targetDir/$targetFile" >> $ARCDIR/$KENIKI.ls
    echo "#! NG  $targetDir/$targetFile is not found"
    ng=$ng+1
  fi
done < $PRMFILE
sort $TMPDIR/$KENIKI.info | uniq > $ARCDIR/$KENIKI.info

( cd $TARDIR; tar cvf - $TARNAM | compress -cf > $RESULTF )
cksum $RESULTF > $ENDFILE
echo "#  OK $RESULTF created"
echo "#  OK $ENDFILE created"


##
## Final
##
typeset -i rtn=-1
echo "#"
echo "#  Result  Total: $no  OK: $ok  NG: $ng"
echo "#  開始時間： $STIME"
echo "#  終了時間： $( date '+%Y/%m/%d %H:%M:%S' )"
echo "#"
if (( $no > 0 )) && (( $ng == 0 ));then
  rm -fr $TMPDIR
  rm -fr $ARCDIR
  rtn=0
elif (( $ng > 0 ));then
  rtn=ng
fi

# find . -type f -mmin -60

exit $rtn
