var request = require("sync-request");
var util = require('./dbutils.js');
exports.gettoken = function () {
    //var request = require("sync-request");
    var username = 'U0JXdG9ETFVU'
    var password = 'MjU4MDA1MDM'
    sgurl = 'http://data.shenguyun.com:8088/sgck-datainterface/v1/login?' +
        'name=' + username + '&pwd=' + password + '='
    var ret = request('get', sgurl).getBody();
    var token = JSON.parse(ret).token;
    console.log("--沈鼓token--" + token);
    return token;
};

exports.singleunit = function (jizuid) {

    var token = this.gettoken();
    sgurl = 'http://data.shenguyun.com:8088/sgck-datainterface/v1/positions?' +
        'token=' + token + '&macids=' + jizuid.toString();
    var response = request('get', sgurl).getBody();
    var ret = JSON.parse(response).data
    return ret;
};

exports.historydata = function (jizuid, starttime, endtime) {

    var moment = require('moment');
    var starttamp = moment(starttime).format('x');
    var endtamp = moment(endtime).format('x');
    var positons = this.singleunit(jizuid);
    var token = this.gettoken();
    //console.log("----"+JSON.stringify(positons));
    var vibs = positons.filter(value => value.type == "PT_VIB");
    //console.log("----"+JSON.stringify(vibs));
    //{"id":"1508170804352110002","itemNo":"43K1101A","name":"转速","acquireType":1,"type":"PT_SPEED","work_rev":7420}
    var speeds = positons.filter(value => value.type == "PT_SPEED");
    //console.log("----"+JSON.stringify(speeds));
    var statics = positons.filter(value => value.type == "PT_STATIC");
    //console.log("----"+JSON.stringify(statics));

    var retvibs = [];
    var retsps = [];
    var retstatics = [];

    for (let vb in vibs) {
        //?????
        console.log("--speedid--"+vibs[vb].id);
        let returl = this.getposdatabyurl(token,vibs[vb].id,starttamp,endtamp);
        for(let i =0;i< returl.length;i++){
            //{"datatime":1592582305680,"gap":-9.420279502868652,"pos_status":4096,"speed":7499}
            returl[i]['formattime'] = moment(parseInt(returl[i]['datatime'])).format('YYYY-MM-DD hh:mm:ss');
            if(i == 2){
                console.log("---vibs---"+JSON.stringify(returl[i]));
            }
            retvibs.push(returl[i]);
        }
        if(vb == '2'){
            break;
        }
    }

    //
    for (let sp in speeds) {
        //?????
        console.log("--speedid--" + speeds[sp].id);
        let returl = this.getposdatabyurl(token, speeds[sp].id, starttamp, endtamp);
        for (let i = 0; i < returl.length; i++) {
            //{"datatime":1592582305680,"gap":-9.420279502868652,"pos_status":4096,"speed":7499}
            returl[i]['formattime'] = moment(parseInt(returl[i]['datatime'])).format('YYYY-MM-DD hh:mm:ss');
            retsps.push(returl[i]);
            if(i == 2){
                console.log("--speeds----"+JSON.stringify(returl[i]));
            }
        }
        if(sp == '2'){
            break;
        }
    }
    for (let ss in statics) {
        //?????
        console.log("--staticid--" + statics[ss].id);
        let returl = this.getposdatabyurl(token, statics[ss].id,starttamp,endtamp);
        for (let i = 0; i < returl.length; i++) {
            //{"datatime":1592582305680,"gap":-9.420279502868652,"pos_status":4096,"speed":7499}
            returl[i]['formattime'] = moment(parseInt(returl[i]['datatime'])).format('YYYY-MM-DD hh:mm:ss');
            //console.log("------"+JSON.stringify(returl[i]));
            retstatics.push(returl[i]);
            if(i == 2){
                console.log("--statics----"+JSON.stringify(returl[i]));
            }
        }
        if(ss == '2'){
            break;
        }
    }
    console.log("----count---" + retvibs.length);
    console.log("----count---" + retsps.length);
    console.log("----count---" + retstatics.length);
    this.savesqlsps(jizuid, retsps);
    this.savesqlstatic(jizuid, retstatics);
    this.savesqlvid(jizuid, retvibs);
};

exports.getposdatabyurl = function (token, posid, starttamp, endtamp) {

    posurl = 'http://data.shenguyun.com:8088/sgck-datainterface/v1/hisdata?' +
        'token=' + token + '&posid=' + posid.toString() +
        '&codes=' + '&start=' + starttamp.toString() + '&end=' + endtamp.toString()

    console.log("---the-posurl--"+posurl);
    var response = request('get', posurl).getBody();
    console.log("-getposdatabyurl--response---" + response.length);
    if (response.length == 0) {
        return [];
    }
    var data = JSON.parse(response).data;
    console.log("--the-full-data--" + JSON.parse(response));
    console.log("--length--" + data.length);
    console.log("--getposdatabyurl--" + JSON.stringify(data[0]));
    return data;
};

exports.savesqlsps = function (macid, retsps) {

    var conn = util.GetConn();
    var tbspeed = "id" + macid + "pt_speed"
    var ctbspeedsql = "Create Table If Not Exists " + tbspeed +
        "(`datatime` bigint(20) NULL DEFAULT NULL," +
        "`pos_status` double NULL DEFAULT NULL," +
        "`gap` double NULL DEFAULT NULL," +
        "`speed` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL," +
        "`formattime` datetime(0) NULL DEFAULT NULL" +
        ") ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;"
    
    var async = require('async');
    async.series({
        createTable: function (done) {
            conn.query(ctbspeedsql, function (error, results,) {
                if (error) {
                    done('err', error);
                }
                else {
                    done(null, "ok");
                }
            });
        }
    }, function (error, result) {
        if(error){
            console.log("------error-------");
            util.CloseConn(conn);
            return;
        }
        if(!error){
            for (let sp in retsps) {
                conn.query('INSERT INTO ' + tbspeed + ' SET ?', retsps[sp], function (error, results, fields) {
                    if (error) {
                    }
                    else {
                    }
                });
            }
        }
    });
};

exports.savesqlstatic = function (macid, retsps) {

    var conn = util.GetConn();
    var tablename = "id" + macid + "pt_static"
    var createsql = "Create Table If Not Exists " + tablename +
        "(`datatime` bigint(20) NULL DEFAULT NULL," +
        "`pos_status` double NULL DEFAULT NULL," +
        "`value` double NULL DEFAULT NULL," +
        "`formattime` datetime(0) NULL DEFAULT NULL" +
        ") ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;"
    
    var async = require('async');
    async.series({
        createTable: function (done) {
            conn.query(createsql, function (error, results,) {
                if (error) {
                    done('err', error);
                }
                else {
                    done(null, "ok");
                }
            });
        }
    }, function (error, result) {
        if(error){
            console.log("------error-------");
            util.CloseConn(conn);
            return;
        }
        if(!error){
            for (let sp in retsps) {
                conn.query('INSERT INTO ' + tablename + ' SET ?', retsps[sp], function (error, results, fields) {
                    if (error) {
                    }
                    else {
                    }
                });
            }
        }
    });
};

exports.savesqlvid = function (macid, retvibs) {

    var conn = util.GetConn();
    var tablename = "id" + macid + "pt_vid"
    var createsql = "Create Table If Not Exists " + tablename +
        "(`datatime` bigint(20) NULL DEFAULT NULL," +
        "`gap` double NULL DEFAULT NULL," +
        "`half_freq` double NULL DEFAULT NULL," +
        "`one_freq_x` double NULL DEFAULT NULL," +
        "`one_freq_y` double NULL DEFAULT NULL," +
        "`optional_freq_one` double NULL DEFAULT NULL," +
        "`optional_freq_two` double NULL DEFAULT NULL," +
        "`p_value` double NULL DEFAULT NULL," +
        "`pos_status` double NULL DEFAULT NULL," +
        "`pp_value` double NULL DEFAULT NULL," +
        "`remain_freq` double NULL DEFAULT NULL," +
        "`rms` double NULL DEFAULT NULL," +
        "`speed` double NULL DEFAULT NULL," +
        "`two_freq_x` double NULL DEFAULT NULL," +
        "`two_freq_y` double NULL DEFAULT NULL," +
        "`formattime` datetime(0) NULL DEFAULT NULL" +
        ") ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;"
    
    var async = require('async');
    async.series({
        createTable: function (done) {
            conn.query(createsql, function (error, results,) {
                if (error) {
                    done('err', error);
                }
                else {
                    done(null, "ok");
                }
            });
        }
    }, function (error, result) {
        if(error){
            console.log("------error-------");
            util.CloseConn(conn);
            return;
        }
        if(!error){
            for (let sp in retvibs) {
                conn.query('INSERT INTO ' + tablename + ' SET ?', retvibs[sp], function (error, results, fields) {
                    if (error) {
                    }
                    else {
                    }
                });
            }
        }
    });
};
