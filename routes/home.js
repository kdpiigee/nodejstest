var express = require('express');
var router = express.Router();
var util = require('./dbutils.js');
var logutil = require('./log4jsutil');
var http = require('http');
const logger4js = logutil.getInstance().getLogger('webservice');

var multer = require('multer')
var upload = multer({
  dest: 'upload/',
  filename(req, file, cb) {
    cb(null, Date.now() + '-wsgi');
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('home');
});

router.post('/upload-single', upload.single('logo'), function (req, res, next) {
  res.send({ ret_code: '0' });
});

router.get('/upload', function (req, res, next) {
  res.render('upload');
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

  // var path = require('path'); //系统路径模块
  // var fs = require('fs'); //文件模块
  // var file = path.join(__dirname, 'config.json'); //文件路径，__dirname为当前运行js文件的目录
  // var modelData = new Object
  // fs.readFile(file, 'utf-8', function (err, data) {
  //   if (err) {
  //   } else {

  //     res.json(data)
  //     jsonContent = JSON.parse(data);
  //   }
  // });
  res.json("ok")
});


//机组List数据取得
router.get('/getMachines', function (req, res, next) {

  var result = req.query;
  var pPage = result.page;
  var pLimit = result.limit;
  var conn = util.GetConn();
  var async = require('async');
  async.series({
    selectCount: function (done) {
      var selSql = "select count(1) as count from  machine_master";
      conn.query(selSql, function (err, rows, result) {
        if (err) {
          done('err', err);
        }
        done(null, rows);
      })
    },
    selectData: function (done) {
      var sql = "select * from  (SELECT A.id,name ,host,port,dbname,datastarttime ,dataendtime,B.statuname as `status`,A.isautoupdate  FROM machine_master A,machine_status B where A.`status` = B.id ORDER BY id desc)  C limit 0,10";
      if (pPage !== null && pPage !== undefined) {
        sql = "select * from  (SELECT A.id,name ,host,port,dbname,datastarttime ,dataendtime,B.statuname as `status`,A.isautoupdate " +
          "FROM machine_master A,machine_status B where A.`status` = B.id ORDER BY id desc)  C limit " + (pPage - 1) * pLimit + "," + pLimit;
      }
      conn.query(sql, function (err, rows, fields) {
        if (err) {
          done('err', err);
        }
        done(null, rows);
      })
    }
  }, function (error, result) {
    if (!error) {
      util.CloseConn(conn);
      var ret = {
        "code": 0,
        "msg": "",
        "count": result.selectCount[0].count,
        "data": result.selectData
      }
      res.json(ret);
    }
    else {
      util.CloseConn(conn);
      res.json("err");
    }
  });
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

router.get('/checkhandupdate', function (req, res) {
  console.log("---------id------" + req.body.id);
  var conn = util.GetConn();
  var sql = "SELECT * FROM `machine_master` WHERE `status` = 2";
  conn.query(sql, function (err, rows, fields) {
    if (err) throw err
    util.CloseConn(conn);
    if (rows.length > 0) {
      res.json(true)
    }
    else {
      res.json(false);
    }
  })
})
router.post('/loadData', function (req, loadRes) {

  var stepRets = {
    select: null,
    getconfig: null
  };
  var dc = require('./datacollection.js');
  var ret = dc.singleunit(req.body.name)
  if (ret.length == 0) {
    loadRes.json("err");
    loadRes.end();
    return;
  }

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
        //port:5000,
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

      loadRes.json("手动更新中");
      // var conn = util.GetConn();
      // var upSql = "update machine_master set `status` = 2 where id = " + req.body.id;
      // conn.query(upSql, function (err, rows, result) {
      //   if (err) throw done("error", err)
      //   util.CloseConn(conn);
      //   loadRes.json("手动更新中");
      // });
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

module.exports = router;
