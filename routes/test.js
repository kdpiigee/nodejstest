var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('test', { title: 'Express' });
});

router.get('/getjizhu', function (req, res, net) {


  var mysql = require('mysql')
  var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'jiyun'
  })

  connection.connect()

  connection.query('SELECT * FROM test limit 50', function (err, rows, fields) {
    if (err) throw err
     res.json(rows);
    //console.log('The solution is: ', rows[0].solution)
  })

  connection.end()

});

module.exports = router;
