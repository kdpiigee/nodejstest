var express = require('express');
var router = express.Router();

var logutil = require('./log4jsutil');
const logger4js = logutil.getInstance().getLogger('webservice');

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

router.post('/congit', function (req, res) {

  logger4js.info('congit处理开始执行,前端获取数据为--'+req.body.ssh);
  var process = require('child_process');
  process.exec('./chkdirclone.sh '+req.body.ssh, function (error, stdout, stderr) {

    if(error){

      logger4js.info('chkdirclone.sh脚本执行出错--'+error);
    }
    else
    {
      logger4js.info('chkdirclone.sh脚本执行出错完成--'+stdout);

    }    
    var index = stdout.indexOf('done');
    if (index > 0){
      res.json("ok");
    }
    else{
      res.json("no");
    }
  });
});

module.exports = router;
