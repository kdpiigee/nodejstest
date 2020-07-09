var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('test', { title: 'Express' });
});

router.get('/getjizhu', function (req, res, net) {


  var mysql = require('mysql')
  // var connection = mysql.createConnection({
  //   host: 'localhost',
  //   user: 'root',
  //   password: '123456',
  //   database: 'jiyun'
  // })
  //process.env.NODE_MySQL_URI
  var connection = mysql.createConnection({
    host: process.env.NODE_MySQL_HOSTNAME,
    user: process.env.NODE_MySQL_USERNAME,
    password: process.env.NODE_MySQL_PASSWORD,
    database: process.env.NODE_MySQL_DATABASE,
    port:process.env.NODE_MySQL_PORT
  });

  connection.connect();

  connection.query('SELECT * FROM test limit 50', function (err, rows, fields) {
    if (err) throw err
     res.json(rows);
    //console.log('The solution is: ', rows[0].solution)
  })

  connection.end()

});

router.get('/getprocess',function(req,res,next){
  var gruntPath=process.env.NODE_MySQL_HOSTNAME;
  console.log('----',gruntPath);
  res.json(gruntPath);
});
module.exports = router;
