var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var homeRouter = require('./routes/home');
var gitRouter = require('./routes/gitset');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/gitset', gitRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

if (process.env.NODE_DEV != "本机") {
  var shprocess = require('child_process');
  shprocess.execSync("chmod +x sshgen.sh");
  shprocess.execSync("chmod +x autopush.sh");
  shprocess.execSync("chmod +x clone.sh");
  shprocess.execSync("chmod +x installtool.sh");
  shprocess.execSync("chmod +x chkdirclone.sh");
  shprocess.execSync("./installtool.sh");
}


var logutil = require('./routes/log4jsutil');
const logger4js = logutil.getInstance().getLogger('webservice');
logger4js.info('tcl和expect安装完成');

module.exports = app;
