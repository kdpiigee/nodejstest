var mysql = require('mysql');
exports.GetConn = function () {
    var connection = null;
    if (process.env.NODE_DEV == "本机") {
        connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'jiyun'
        });
    }
    else {
        process.env.NODE_MySQL_URI
        var connection = mysql.createConnection({
            host: process.env.NODE_MySQL_HOSTNAME,
            user: process.env.NODE_MySQL_USERNAME,
            password: process.env.NODE_MySQL_PASSWORD,
            database: process.env.NODE_MySQL_DATABASE,
            port: process.env.NODE_MySQL_PORT
        });
    }
    connection.connect();
    return connection;
};

exports.CloseConn = function (conn) {
    conn.end();
};