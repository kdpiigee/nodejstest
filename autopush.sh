#!/bin/bash
pname=$(sed -n 2p git/gitresult.txt)
filename=$(sed -n 3p git/gitresult.txt)
acc=$(sed -n 4p git/gitresult.txt)

git config --global user.email ${acc}
git config --global user.name ${acc}
addtime=$(date +"%Y-%m-%d %H:%M:%S")
cd git/${pname}
#echo "---pwd---"$(pwd)
#echo "git config file push at "$addtime
git fetch --all
git reset --hard origin/master
git pull origin master
cp -f ../../public/customxml/temp.xml ${filename}
git add ${filename}
git commit -m '"'"push the configfile at ""$addtime"'"'
git push origin master
exit 0