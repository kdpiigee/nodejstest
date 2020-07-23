#!/bin/bash
rm -rf .ssh
rm -rf git
ssh-keygen  -t rsa -N '' -C $1
mkdir git

cat .ssh/id_rsa.pub | while read line
do
   echo $line
done