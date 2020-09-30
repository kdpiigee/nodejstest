var schedule = require('node-schedule');
var logutil = require('./log4jsutil');
var util = require('./dbutils.js');
var moment = require('moment');
var http = require('http');
const logger4js = logutil.getInstance().getLogger('webservice');

var schedules = {
  "day": null,
  "week": null,
  "month": null
}
exports.regschedule = function () {
  schedules.day = schedule.scheduleJob('10 0 0 * * *', function () {
    logger4js.info('schedule start day:' + new Date());
    console.log('schedule start day:' + new Date());
    var conn = util.GetConn();
    var sqlstr = " SELECT * FROM `machine_master` where isautoupdate = 'true' and updateinterval = '天'"
    conn.query(sqlstr, function (err, rows, fields) {
      util.CloseConn(conn);
      if (err) {
        logger4js.info('schedule start day get data from db err');
      }
      else {
        for (var r in rows) {
          var start = moment().subtract(1, 'days').format('YYYY-MM-DD 00:00:00');
          var end = moment().format('YYYY-MM-DD 00:00:00');
          autoloadfrompython(rows[r],start,end);
        }
      }
    })
  });

  schedules.week = schedule.scheduleJob('10 0 2 * * 1', function () {
    logger4js.info('schedule start week:' + new Date());
    console.log('schedule start week:' + new Date());
  });


  schedules.month = schedule.scheduleJob('10 0 3 1 * *', function () {
    logger4js.info('schedule start month:' + new Date());
    console.log('schedule start month:' + new Date());
  });
}

exports.closeschedule = function () {

  schedules.day.cancel();
  schedules.week.cancel();
  schedules.month.cancel();
}

function autoloadfrompython(row, starttime, endtime) {
  var jsonData = {
    "type": "machine",
    "param": {
      "id": row.id,
      "name": row.name,
      "host": "",
      "port": "",
      "dbname": "",
      "datastarttime": starttime,
      "dataendtime": endtime,
      "modifytime": "",
      "status": ""
    }
  }
  postdata = JSON.stringify(jsonData); //数据以json格式发送

  var path = require('path'); //系统路径模块
  var fs = require('fs'); //文件模块
  var file = path.join(__dirname, 'config.json'); //文件路径，__dirname为当前运行js文件的目录
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      logger4js.error('读取配置文件失败');
    } else {
      jsonContent = JSON.parse(data);
      logger4js.info('按天自动更新:' + postdata);
      var options = {
        host:jsonContent.pythonhost,
        path:jsonContent.pythonpath,
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
        });
      });
      req.write(postdata);
      req.end;
    }
  });
}