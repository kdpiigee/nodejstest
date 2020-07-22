#!/bin/bash
cd tool/
tar -zxvf tcl8.4.11-src.tar.gz
tar -zxvf expect-5.43.0.tar.gz
cd tcl8.4.11/unix/
./configure --prefix=$HOME
make
make install
cd ../../expect-5.43
./configure --prefix=$HOME  --with-tclinclude=/opt/app-root/src/tool/tcl8.4.11/generic
make
./configure --prefix=$HOME  --with-tclinclude=/opt/app-root/src/tool/tcl8.4.11/generic
make
make install
