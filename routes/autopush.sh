#!/bin/bash
addtime=$(date +"%Y-%m-%d %H:%M:%S")
cd public/customxml
#echo "---pwd---"$(pwd)
#echo "git config file push at "$addtime
git fetch --all
git reset --hard origin/master
git pull origin master

cp -f temp.xml ../../git/$2/$1
git add $1
git commit -m '"'"push the configfile at ""$addtime"'"'
git push origin master
exit 0