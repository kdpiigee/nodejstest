#!/bin/bash
git config --global user.email "809330447@qq.com"
git config --global user.name "809330447@qq.com"
addtime=$(date +"%Y-%m-%d %H:%M:%S")
cd git/$2
#echo "---pwd---"$(pwd)
#echo "git config file push at "$addtime
git fetch --all
git reset --hard origin/master
git pull origin master
cp -f ../../public/customxml/temp.xml $1
git add $1
git commit -m '"'"push the configfile at ""$addtime"'"'
git push origin master
exit 0