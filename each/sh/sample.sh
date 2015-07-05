#!/bin/sh
# DESC :
#
# Usage: sample.sh  {県域}
#
# Ex.  : sh sample.sh  osaka
#
# More Info. : tail -12 sample.sh
#
#
## Args
typeset keniki=${1:-osaka}

## Base
APPLNAM=$( basename ${0#-} .sh )
BASEDIR=$( cd `dirname ${0#-}`;pwd )
CONFDIR=$BASEDIR
Dying () { 
  echo $@ >&2
  [[ PS1 != "" ]] && exit 1
  return 1
}

## Config/Const
[ -r $CONFDIR/env ] || Dying "Fail to include $CONFDIR/env"
. $CONFDIR/env

alias cksum='echo'

## Dirs/Files
TMPDIR=$BASEDIR/files/temp/$$
[ -d $TMPDIR ] && rm -fr $TMPDIR
mkdir -p $TMPDIR

TARDIR=$BASEDIR/work/csvfile/$keniki
[ -d $TARDIR ] && rm -fr $TARDIR
mkdir -p $TARDIR

## Exit/Err Handle
ExitHandle () {
  [ -d $TMPDIR ] && rm -fr $TMPDIR
}
trap 'ExitHandle;exit' EXIT

ErrHandle () {
  local rtn=$1
  local lin=$2

  trap '' EXIT
  Dying "# line: $lin: Error occured($rtn)"
}
trap 'ErrHandle $? $LINENO' ERR

## Files
PRMORG=$BASEDIR/$APPLNAM.conf
PRMFILE=$TMPDIR/$APPLNAM.tmp
cat $PRMORG                |
egrep -v '^#'              |
sed 's/ +\t +/\t/g'        |
sed "s/{keniki}/$keniki/g" > $PRMFILE
pipestatus "${PIPESTATUS[@]}"

## Main
while read target_dir  target_file  dist_dir;do
  TARFILE=$TARDIR/$( echo ${dist_dir#/} | sed 's/\//\./g' ).tar
  
  ( cd $target_dir ; ls -l $target_file ) >> $TARDIR/$keniki.ls
  ( cd $target_dir ; cksum $target_file ) >> $TARDIR/$keniki.cksum
  echo "$TARFILE\t$dist_dir"              >> $TARDIR/$keniki.info
  if [ -e $TARFILE ];then
    ( cd $target_dir ; tar cvf $TARFILE $target_file )
  else
    ( cd $target_dir ; tar rvf $TARFILE $target_file )
  fi
done < $PRMFILE
