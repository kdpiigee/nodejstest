#!/bin/bash
if [ ! -d "git/configtest" ]; then
   ./clone.sh $1
   echo "ok done" > git/gitresult.txt
   echo $2 >> git/gitresult.txt 
   echo $3 >> git/gitresult.txt
   echo $4 >> git/gitresult.txt
fi
