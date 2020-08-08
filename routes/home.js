var express = require('express');
var router = express.Router();
var util = require('./dbutils.js');
var logutil = require('./log4jsutil');
var http = require('http');
const logger4js = logutil.getInstance().getLogger('webservice');

/* GET home page. */
router.get('/', function (req, res, next) {
  // var execPro = require('child_process');
  // execPro.exec('cat git/gitresult.txt', function (error, stdout, stderr) {
  //   logger4js.info('读取gitresult的结构#' + error + "#" + stdout);
  //   if (stdout.indexOf("done") > 0) {
  //     res.render('home');
  //   }
  //   else {
  //     res.render('gitset');
  //   }
  // });
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

  //pushGitRemote1(res);

  var path = require('path'); //系统路径模块
  var fs = require('fs'); //文件模块
  var file = path.join(__dirname, 'config.json'); //文件路径，__dirname为当前运行js文件的目录
  var modelData = new Object
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
    } else {

      res.json(data)
      jsonContent = JSON.parse(data);
    }
  });

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

router.post('/loadData', function (req, loadRes) {

  var stepRets = {
    select: null,
    getconfig: null
  };
  var async = require('async');
  async.series({
    select: function (done) {
      //逻辑处理
      var conn = util.GetConn();
      var selSql = "select * from  machine_master where id = " + req.body.id;
      //xml写入
      console.log("----sql------" + selSql);
      conn.query(selSql, function (err, rows, result) {
        if (err) throw err
        util.CloseConn(conn);
        stepRets.select = rows[0];
        done(null, rows[0]);
      })
    },
    getconfig: function (done) {
      var path = require('path'); //系统路径模块
      var fs = require('fs'); //文件模块
      var file = path.join(__dirname, 'config.json'); //文件路径，__dirname为当前运行js文件的目录
      fs.readFile(file, 'utf-8', function (err, data) {
        if (err) {
          done('err', '读取配置文件失败');
        } else {
          jsonContent = JSON.parse(data);
          stepRets.getconfig = jsonContent;
          done(null, jsonContent);
        }
      });
    },
    pushconfig: function (done) {
      var jsonData = {
        "type": "machine",
        "param": stepRets.select
      }
      postdata = JSON.stringify(jsonData); //数据以json格式发送
      logger4js.info('数据迁移Json数据:' + postdata);
      console.log("---------" + postdata);
      var options = {
        host: stepRets.getconfig.pythonhost,
        path: stepRets.getconfig.pythonpath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postdata, 'utf8')
        }
      }
      var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
          console.log("data:", data);   //一段html代码
          done(null, data)
        });
      });
      req.write(postdata);
      req.end;
    }
  }, function (error, result) {
    if (!error) {

      var conn = util.GetConn();
      var upSql = "update machine_master set `status` = 2 where id = " + req.body.id;
      conn.query(upSql, function (err, rows, result) {
        if (err) throw done("error", err)
        util.CloseConn(conn);
        loadRes.json("数据迁移中");
      });
    }
  });

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

// function writeToXml(id) {

//   var conn = util.GetConn();
//   var selSql = "select * from  machine_master where id = " + id;
//   //xml写入
//   console.log("----sql------" + selSql);
//   conn.query(selSql, function (err, rows, result) {
//     if (err) throw err

//     console.log("zhelileme " + rows[0]);
//     util.CloseConn(conn);

//     const fxp = require("fast-xml-parser");
//     var defaultOptions = {
//       format: true,
//     };
//     var content = { root: rows[0] }
//     const obj2xml = new fxp.j2xParser(defaultOptions).parse(content)
//     var fs = require('fs'); // 引入fs模块
//     fs.writeFile('././public/customxml/temp.xml', obj2xml, { 'flag': 'w' }, function (err) {
//       if (err) {
//         throw err;
//       }
//       pushGitRemote();
//     });

//   })

// }

// function pushGitRemote() {
//   var process = require('child_process');
//   process.exec("./autopush.sh ", function (error, stdout, stderr) {

//   });
// }

module.exports = router;
