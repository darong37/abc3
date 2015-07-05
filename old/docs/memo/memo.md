

## �f�[�^�t�@�C���̐ݒ�m�F�i���O�j  

~~~~sql  
col TABLESPACE_NAME format a12  
col FILE_NAME format a40  
col next_MB for 999,999,999.99  
col size_MB for 999,999,999.99  
col maxsize_MB for 999,999,999.99  

select TABLESPACE_NAME  
       ,FILE_NAME  
       ,AUTOEXTENSIBLE  
       ,MAXBYTES/1024/1024    maxsize_MB  
       ,BYTES/1024/1024       size_MB  
       ,INCREMENT_BY*8/1024   next_MB  
from   DBA_DATA_FILES   
--where  tablespace_name not in ('UNDOTBS1')  
order  by tablespace_name;  

~~~~  


> 2014/03/27 15:42:50 �X�V

------------------



## TEMP�e�ʊm�F  

~~~~sql  
set line 1000  
col TABLESPACE_NAME format a20  
col FILE_NAME       format a55  
col SIZE_MBYTES     for 99,999,990  
col MAXSIZE_MBYTES  for 99,999,990  

SELECT  
    TABLESPACE_NAME ,   
    FILE_NAME ,STATUS ,   
    BYTES/1024/1024 AS SIZE_MBYTES,  
    AUTOEXTENSIBLE,  
    MAXBYTES/1024/1024 AS MAXSIZE_MBYTES  
 FROM  
    DBA_TEMP_FILES ;   

~~~~  


> 2014/03/27 15:46:35 �X�V

------------------



## �Z�b�V�������  

~~~~sql  
col USERNAME for a8  
col SCHEMANAME for a8  
col PORT for 999999  
col TERMINAL for a16   
col TYPE for a12  
col PROGRAM for a40  
col STATUS for a8  
col MACHINE for a28  

select USERNAME,SCHEMANAME,PORT,TERMINAL,TYPE,PROGRAM,STATUS,MACHINE,LOGON_TIME from v$session order by type,username;  

~~~~  

> 2014/03/19 10:58:13 �X�V

------------------



## �A���[�g���O���̏o�͐�ݒ�  

~~~~sql  
show parameter dest  


~~~~  

> 2014/03/19 09:56:58 �X�V

------------------



## �e�[�u���X�y�[�X�̎g�p�󋵊m�F  

~~~~sql  
col �\�̈於 format a20  
col ���T�C�Y[MB] for 99,999,990  
col �g�p�e��[MB] for 99,999,990  
col �󂫗e��[MB] for 99,999,990  
col �g�p��[��] for 990  
col �ő�T�C�Y[MB] for 99,999,990  
col �ő�󂫗e��[MB] for 99,999,990  
col �ő�g�p��[��] for 990  

SELECT   
    D.TABLESPACE_NAME                     AS "�\�̈於"  
  , D.SIZE_MB                             AS "���T�C�Y[MB]"  
  ,(D.SIZE_MB - F.FREE_MB)                AS "�g�p�e��[MB]"  
  , F.FREE_MB                             AS "�󂫗e��[MB]"  
  ,(1 - F.FREE_MB/D.SIZE_MB) * 100        AS "�g�p��[��]"  
  , D.MAX_MB                              AS "�ő�T�C�Y[MB]"  
  ,(D.MAX_MB - (D.SIZE_MB - F.FREE_MB))   AS "�ő�󂫗e��[MB]"  
  ,(1 - (D.MAX_MB - (D.SIZE_MB - F.FREE_MB))/D.MAX_MB) * 100   
                                          AS "�ő�g�p��[��]"  
FROM (  
  SELECT   
    TABLESPACE_NAME  
  , SUM(BYTES)/1024/1024 AS SIZE_MB  
  , case  
      when AUTOEXTENSIBLE = 'YES'  
      then SUM(MAXBYTES)/1024/1024  
      else   SUM(BYTES)/1024/1024  
    end  AS MAX_MB  
  FROM  DBA_DATA_FILES  
  GROUP BY TABLESPACE_NAME,AUTOEXTENSIBLE  
) D,  
(
  SELECT   
    TABLESPACE_NAME  
  , SUM(BYTES)/1024/1024 AS FREE_MB  
  FROM  DBA_FREE_SPACE  
  GROUP BY TABLESPACE_NAME  
) F  
WHERE D.TABLESPACE_NAME = F.TABLESPACE_NAME  
order by D.TABLESPACE_NAME;  

~~~~  

> 2014/03/17 17:50:25 �X�V

------------------



## �G�N�X�e���V�����}�b�v  

~~~~sql  
col tablespace_name for a12  
select tablespace_name from dba_tablespaces order by tablespace_name;  

break on FILE_ID skip page  
col segment for a40  
select  
  tablespace_name,   
  file_id,   
  block_id,   
  blocks,   
  owner||'.'||segment_name     segment   
from   
  dba_extents  
where  
  TABLESPACE_NAME = '&&TABLESPACE_NAME'  
union   
select   
  tablespace_name,   
  file_id,   
  block_id,   
  blocks,   
  '<free>'   
from   
  dba_free_space   
where  
  TABLESPACE_NAME = '&&TABLESPACE_NAME'  
order by 1,2,3;  

undefine TABLESPACE_NAME

~~~~  

> 2014/03/14 10:23:16 �X�V

------------------



## Package�̃\�[�X���擾����  

~~~~sql  
select distinct name from dba_source where TYPE ='PACKAGE' and name like '&name';  

select text from dba_source where TYPE ='PACKAGE' and name = '&name' order by line;  

select text from dba_source where TYPE ='PACKAGE BODY' and name = '&name' order by line;  


~~~~  

> 2014/03/12 18:22:25 �X�V

------------------



## �p�X���[�h���킩��Ȃ����[�U�̊����؂����������  
sysdba��sqlplus�N��  

~~~~sql  
select NAME,PASSWORD from sys.user$ where name='&name';  

ALTER USER SYS IDENTIFIED BY VALUES '&PASSWORD';  

~~~~  

> 2014/03/12 16:10:36 �X�V

------------------


## �e�[�u���J�����̃R�����g
  
~~~~sql
col COLUMN_NAME for a50
col COMMENTS for a80

select table_name from dictionary where table_name like '&table_name';

select COLUMN_NAME,COMMENTS 
from   DBA_COL_COMMENTS 
join   DBA_TAB_COLS using(TABLE_NAME,COLUMN_NAME) 
where  table_name = '&table_name' 
order  by COLUMN_ID;

~~~~

> 2014/03/12 13:05:46 �X�V

------------------



## sqlplus�Ō��ʂ�HTML�t�@�C���ɏo��
  
~~~~sql
spool a.html
set markup html on 

select ; 

set markup html off 
spool off

host a.html --�u���E�U��html�t�@�C�����J���܂��B
  
~~~~

> 2014/03/12 11:40:33 �X�V

------------------



## sqlplus �N��
  
~~~~bash
  
export ORACLE_SID=prdcpf
sqlplus / as sysdba

~~~~

~~~~sql

set pagesize 2000
set line 200

col HOST_NAME for a20
select HOST_NAME,INSTANCE_NAME,STATUS from v$instance;
    -- HOST_NAME            INSTANCE_NAME                                    STATUS
    -- -------------------- ------------------------------------------------ ------------------------------------
    -- MEC-PRE3D0111        prdcpf                                           OPEN

~~~~

> 2014/03/11 11:01:16 �X�V

------------------



## vi�R�}���h
  
�敪        |�R�}���h|����
------------|--------|------------------------------
�J�[�\���ړ�|h       |��
�J�[�\���ړ�|j       |��
�J�[�\���ړ�|k       |��
�J�[�\���ړ�|l       |�E
�J�[�\���ړ�|5l      |�T�����E�ɃJ�[�\�����ړ�����
�J�[�\���ړ�|Shift +g|�t�@�C���̍Ō�̍s�̐擪�Ɉړ�
�J�[�\���ړ�|gg      |�t�@�C���̐擪�Ɉړ�
�J�[�\���ړ�|$       |�s�̍Ō�Ɉړ�
�J�[�\���ړ�|�O �[�� |�s�̐擪�Ɉړ�
�J�[�\���ړ�|^       |�s�̍ŏ��̋󔒂łȂ������Ɉړ�
�J�[�\���ړ�|G       |�t�@�C���̖����Ɉړ�
�J�[�\���ړ�|Ctrl +f |�y�[�W�A�b�v
�J�[�\���ړ�|Ctrl +��|�y�[�W�_�E��
�J�[�\���ړ�|M       |�J�[�\������ʂ̒��S�Ɉړ�
File�ēǍ�  |:e!     |�ҏW��j������File�̍ēǂݍ���
File�ۑ�    |:wq     |���ݕҏW���̓��e�����̃t�@�C���ɏ�������ŏI��
File�ۑ��I��|:w      |�ҏW���ʂ�ۑ�
�w���v      |:help +Enter|�I�����C���w���v�\��
�ҏW�FUNDO  |u       |���O�̕ҏW��Ԃɖ߂�
�ҏW�F����  |/       |�O��
�ҏW�F����  |?       |���
�ҏW�F����  |n       |�O���Č���
�ҏW�F����  |N       |����Č���
�ҏW�F�폜  |x       |���݃J�[�\���̂��镶�����폜
�ҏW�F�폜  |3x      |���݃J�[�\���̂��镶�����폜�@�J�E���g�̎g�p
�ҏW�F�폜  |X       |�J�[�\�����O�̕������폜
�ҏW�F�폜  |D       |�J�[�\���ȍ~���폜
�ҏW�F�폜  |dw      |���݃J�[�\���̂���P����폜
�ҏW�F�폜  |Shift +d|�J�[�\������s���܂ł��폜
�ҏW�F�폜  |dd      |���݃J�[�\���̂���s���폜�i�J�b�g�j
�ҏW�F�폜  |100dd   |���݃J�[�\���̂���s���폜�@�J�E���g�̎g�p
�ҏW�F�u��  |s/xxx/yyy/    |xxx���������ɒu��
�ҏW�F�u��  |:s/xxx/yyy/g  |�J�[�\���s��S�͈͂Ƃ��āAxxx��yyy�ɒu��
�ҏW�F�u��  |:%s/xxx/yyy/g |�t�@�C����S�͈͂Ƃ��āAxxx��yyy�ɒu��
�ҏW�F�u��  |:%s/xxx/yyy/gc|�t�@�C����S�͈͂Ƃ��āAxxx��yyy�ɒu��  �m�F���Ȃ���B
�ҏW�F�y�[�X�g|p       |�J�[�\���s�̉��Ƀy�[�X�g
�ҏW�F�y�[�X�g|3p      |�J�[�\���s�̉��Ƀy�[�X�g�@�o�b�t�@�[���R��y�[�X�g�����B
�ҏW�F�y�[�X�g|P       |�J�[�\���s�̏�Ƀy�[�X�g
�ҏW�F��������|i       |�C���T�[�g���[�h�ɂȂ�A�J�[�\���̑O�ɕ������}���\
�ҏW�F��������|a       |�C���T�[�g���[�h�ɂȂ�A�J�[�\���̌��ɕ������}���\
�ҏW�F��������|o       |�J�[�\���s�̉��Ɉ�s�󔒍s��}��
�ҏW�F��������|Shift + o|�J�[�\���s�̏�Ɉ�s�󔒍s��}��
�ҏW�F��������|ESC     |�C���T�[�g���[�h����R�}���h���[�h�ɖ߂�
�ҏW�F��������|I       |�J�[�\���s�̐擪������͊J�n
�ҏW�F��������|A       |�J�[�\���s�̖���������͊J�n
�ҏW�F��������|r       |�J�[�\����̕�����u��
�ҏW�F��������|R       |�ȍ~�̓��͂��㏑�����
�ҏW�F��������|O       |�J�[�\���s�̏�Ɉ�s�󔒍s��}��
�ҏW�F��������|J       |�J�[�\���s�ƒ����̍s��A��
�ҏW�F�����N  |yy      |�J�[�\���s�������N�i�R�s�[�j
�ҏW�F�����N  |3yy     |�J�[�\���s�������N�i�R�s�[�j�@�J�E���g�̎g�p
���[�h�ɂ���|�N������|�R�}���h���[�h
���[�h�ɂ���|i       |�R�}���h�@�|���@�C���T�[�g�@���[�h
���[�h�ɂ���|ESC     |�C���T�[�g�@�|���@�R�}���h�@���[�h
���[�h�ɂ���|:       |�R�}���h�@�|���@�������C���G�f�B�^�@���[�h
���[�h�ɂ���|ESC     |�������C���G�f�B�^�@�|���@�R�}���h�@���[�h


> 2014/03/10 18:33:22 �X�V

------------------



## Teraterm �Ń��O�C������
���O�C���F oracle@MEC-PRE3D0111  

~~~~bash
whoami; id; hostname; date
	# oracle
	# uid=1100(oracle) gid=1000(oinstall) groups=1100(dba),1200(oper)
	# MEC-PRE3D0111
cd /oraapp/home
pwd
	# /oraapp/home

~~~~

> 2014/03/10 11:22:42 �X�V

------------------


## Windows Event Log ID
Start Log Service: 6005
Shutdown: 6006

> 2014/03/03 15:14:11 �X�V

------------------


## ���g�p�u���b�N���
~~~~sql
select 
        fs.file_id
    ,   df.file_name
    ,   fs.block_id
    ,   fs.bytes/8/1024  "size"
    ,   fs.block_id + fs.bytes/8/1024 "next ID"
    ,   max(fs.block_id) over ( partition by fs.file_id)
            max_block
from  dba_free_space fs
join  dba_data_files df 
      on df.file_id = fs.file_id
where fs.tablespace_name = upper('"&TABLESPACE_NAME&"')
order by fs.file_id,fs.block_id;

~~~~

> 2014/02/27 14:07:26 �X�V

------------------


## �\�̈�A�f�[�^�t�@�C���ꗗ

~~~~sql
set pagesize 1000
set linesize 200
col TABLESPACE_NAME for a20
col FILE_NAME for a50
col MAXBYTES for 99999999999999
select tablespace_name, file_name, bytes/1024/1024 MBytes, autoextensible, maxbytes/1024/1024 MaxMBytes
from dba_data_files
order by tablespace_name, file_name ;

~~~~


> 2014/02/26 18:48:06 �X�V

------------------


## Msys bash�̋N��

	\.abc\.sys\bin\bash.exe --login -i -c

> 2014/02/26 11:33:49 �X�V

------------------


## �c�c�k���̎擾
�\�uemp�v�̂c�c�k�����擾

~~~~sql
set long 2000
set heading off

select
dbms_metadata.get_ddl('TABLE','EMP')
from dual;
~~~~

> 2014/02/26 11:05:03 �X�V

-------------

~~~~bash
## cron�o�^
# root �Ń��O�C��
cd /var/spool/cron/crontabs/
pwd

# cron�W���u�ݒ�̃o�b�N�A�b�v
ls -l
crontab -l
cp -pi root root.$(date '+%Y%m%d_%H%M%S')
ls -l

#�ꎞ�t�@�C���̍쐬�ƕҏW
cp -i root root.tmp
vi root.tmp

# G
# $
# a
# ���^�[��
# �ȉ����y�[�X�g
50 2 * * 0,1,2,3,4,5,6 /oraapp/home/log_rotate.sh >/dev/null 2>&1
00 7 * * 0,1,2,3,4,5,6 /oraapp/home/log_purge.sh >/dev/null 2>&1
00 8 * * 0,1,2,3,4,5,6 /bin/su - oracle -c "tablespace_check_uat.sh" >/dev/null 2>&1
# �G�X�P�[�v
# :wq

# ���e�m�F
cat root.tmp
diff root root.tmp

# �ݒ�̔��f
crontab root.tmp
crontab -l

# ��n��
rm -i root.tmp
ls -l

~~~~


> 2014/02/21 16:09:03 �X�V

------------------

## Git���|�W�g�����ڍs������@

	git clone --mirror <SOURCE_REPOSITORY_URL>
	cd <REPOSITORY>
	git push --mirror <DESTINATION_REPOSITORY_URL>


> 2014/02/20 09:59:23 �X�V

-------------

## DATAPUMP metadata_only

* DB-ORACLE-DATAPUMP


	expdp hr/hr DIRECTORY=dpump_dir1 DUMPFILE=hr_comp.dmp COMPRESSION=METADATA_ONLY


> 2004/02/19 10:00:00 �X�V

-------------

## Perl Prompt


~~~~perl  
use Term::Prompt;  

	#my $ans = prompt('x', 'question', 'help', 'default' );  
my $ans = prompt('x', 'question ?','','' );  
printf "Ans: '$ans'\n";  

$ans = prompt('x', 'question ?','y/n','' );  
printf "Ans: '$ans'\n";  

$ans = prompt('x', 'question ?','y/n','y' );  
printf "Ans: '$ans'\n";  

$ans = prompt('x', 'question ?','','y' );  
printf "Ans: '$ans'\n";  

~~~~

> 2004/02/18 10:00:00 �X�V

