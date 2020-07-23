#!/opt/app-root/src/bin/expect
cd git
spawn git clone $1
expect "*yes*"
send "yes\n"
expect eof
