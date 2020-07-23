var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('gitset');
});



router.post('/genkey', function (req, res) {

  var process = require('child_process');
  var cmd ='echo -e "\n" | ./sshgen.sh '+ req.body.ac;
  process.exec(cmd, function (error, stdout, stderr) {
    var index = stdout.indexOf('ssh-rsa');
    res.json(stdout.slice(index));
  });
});

module.exports = router;
