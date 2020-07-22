#!/opt/app-root/src/bin/expect
cd git
spawn git clone git@github.com:kdpiigee/configtest.git
expect "*yes*"
send "yes\n"
expect eof
