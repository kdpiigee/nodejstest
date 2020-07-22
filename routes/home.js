var express = require('express');
var router = express.Router();
var util = require('./dbutils.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.get('/getjizhu', function (req, res, net) {

  var conn = util.GetConn();

  conn.query('SELECT * FROM test limit 50', function (err, rows, fields) {
    if (err) throw err
    res.json(rows);
  })

  util.CloseConn(conn);

});

router.get('/getprocess', function (req, res, next) {

  pushGitRemote1(res);

});



router.get('/getMachines', function (req, res, next) {
  var conn = util.GetConn();
  conn.query("SELECT A.id,name ,host,port,dbname,datastarttime ,dataendtime,B.statuname as `status` FROM machine_master A,machine_status B where A.`status` = B.id ORDER BY modifytime desc", function (err, rows, fields) {
    if (err) throw err
    res.json(rows);
  })
  util.CloseConn(conn);
});

router.post('/delMachine', function (req, res) {
  console.log("---------id------" + req.body.id);
  var conn = util.GetConn();
  var delSql = "DELETE from  `machine_master` where id = " + req.body.id;
  conn.query(delSql, function (err, result) {
    if (err) throw err
    util.CloseConn(conn);
    res.json("ok");
  })

});

router.post('/loadData', function (req, res) {

  var conn = util.GetConn();
  var upSql = "update machine_master set `status` = 2 where id = " + req.body.id;
  //xml写入

  conn.query(upSql, function (err, rows, result) {
    if (err) throw err
    util.CloseConn(conn);
    setTimeout(function () {
      writeToXml(req.body.id);
    }, 1000);
    res.json("数据迁移中");
  })
});

router.post('/addMachine', function (req, res) {
  var moment = require('moment');
  var userAddSql = 'INSERT INTO machine_master(name,host,port,dbname,datastarttime,dataendtime,modifytime,status) VALUES(?,?,?,?,?,?,?,1)';
  var userAddSql_Params = [req.body["jizuName"], req.body["jizuURI"], req.body["jizuPort"], req.body["dbName"], req.body["dataStartTime"], req.body["dataEndTime"], moment().format("YYYY-MM-DD HH:mm:ss")];
  var conn = util.GetConn();
  conn.query(userAddSql, userAddSql_Params, function (err, result) {
    if (err) {
      console.log('[INSERT ERROR] - ', err.message);
      return;
    }
    util.CloseConn(conn);
    res.json({ id: result.insertId });

  });
});

function writeToXml(id) {

  var conn = util.GetConn();
  var selSql = "select * from  machine_master where id = " + id;
  //xml写入
  console.log("----sql------" + selSql);
  conn.query(selSql, function (err, rows, result) {
    if (err) throw err

    console.log("zhelileme " + rows[0]);
    util.CloseConn(conn);

    const fxp = require("fast-xml-parser");
    var defaultOptions = {
      format: true,
    };
    const obj2xml = new fxp.j2xParser(defaultOptions).parse(rows[0])
    var fs = require('fs'); // 引入fs模块
    fs.writeFile('././public/customxml/temp.xml', obj2xml, { 'flag': 'w' }, function (err) {
      if (err) {
        throw err;
      }
      pushGitRemote();
    });

  })

}

function pushGitRemote() {
  var config = require('./config');
  var process = require('child_process');
  var cmd = "./autopush.sh " + config["gitfilename"] + " " +config["gitdir"];
  process.execSync('./clone.sh');
  process.exec(cmd, function (error, stdout, stderr) {
  });
}

function pushGitRemote1(res) {
  var config = require('./config');
  var process = require('child_process');
  var cmd = "./autopush.sh " + config["gitfilename"] + " " +config["gitdir"];

  var fs = require("fs") ;
  var stat = fs.statSync('/opt/app-root/src/git/configtest');
  var cun= ""
  if(stat.isDirectory()){
    cun = "存在的"
  }else{
    cun = "不存在"
  }

  process.execSync('./clone.sh');
  res.json('ok---'+cun)
  // process.exec(cmd, function (error, stdout, stderr) {
  //   res.json(cmd)
  // });
}

module.exports = router;
