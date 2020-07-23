#!/opt/app-root/src/bin/expect
cd git
set sshcon [lindex $argv 0]
spawn git clone $sshcon
expect "*yes*"
send "yes\n"
expect eof