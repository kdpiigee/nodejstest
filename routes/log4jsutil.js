const log4js = require('log4js');
log4js.configure({
  appenders: { webservice: { type: 'file', filename: 'webservice.log' } },
  categories: { default: { appenders: ['webservice'], level: 'info' } }
});


exports.getInstance = function () {
    
    return log4js;
};
