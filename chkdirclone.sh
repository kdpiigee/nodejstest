#!/bin/bash
if [ ! -d "git/configtest" ]; then
   ./clone.sh $1
   echo "ok done" > git/gitresult.txt
fi
