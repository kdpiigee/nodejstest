var gCell;

//算法双击编辑事件
function calRowDbClick() {

    $("#cal-table td").dblclick(function () {
        gCell = $(this)
        var temp = $(this);
        var row = $(this).parent().index() + 1; // 行位置
        var col = $(this).index() + 1; // 列位置
        if (col == 2) {
            $('#myModal').modal('show');
        }
    });

};

//左侧边栏点击事件
function leftPanelClick() {

    $("#left-panal a").click(function () {
        var temp = $(this);
        if ($(this)[0].tagName == "A") {
            $("#machine").hide();
            $("#calculation").hide();
            $("#chart").hide();
            $("#left-panal a").removeClass("active"); //移除
            $(this).addClass("active"); // 追加样式
            var curId = $(this).attr('id');
            if (curId == "li-machine") {
                $("#machine").show();
            } else if (curId == "li-cal") {
                initAlgConfig();
                $("#calculation").show();

            } else if (curId == "li-chart") {
                $("#chart").show();
            }

        }

    });

}
//算法设定事件
function submitCal() {
    var selText = $("#cal-select option:selected").text();
    gCell.text(selText);
    $('#myModal').modal('hide');
};
//机组信息添加按钮点击事件
function submitAddRow() {
    var errFlag = false;
    $("#machineInputParam input").each(function (i) {
        var text = $(this).val();
        if (text == "") {
            alert("输入项内有空值，请重新输入");
            errFlag = true
            return false;
        }
    });
    if (errFlag == true) {
        return;
    }

    var jizuName = $("#jizuName").val();
    var jizuURI = $("#jizuURI").val();
    var jizuPort = $("#jizuPort").val();
    var dataStartTime = $("#dataStartTime").val();
    var dataEndTime = $("#dataEndTime").val();
    var dbName = $("#dbName").val();


    //添加数据到 table 第一行
    var addInfo = {
        "jizuName": jizuName,
        "jizuURI": jizuURI,
        "jizuPort": jizuPort,
        "dataStartTime": dataStartTime,
        "dataEndTime": dataEndTime,
        "dbName": dbName,
        "statu": 1
    };

    $.post("/addMachine", addInfo, function (result) {
        console.log("---server-return--" + result.id);
        var row = "<tr id=" + result.id + ">" +
            "<td>" + jizuName + "</td>" +
            "<td>" + jizuURI + "</td>" +
            "<td>" + jizuPort + "</td>" +
            "<td>" + dbName + "</td>" +
            "<td>" + dataStartTime + "</td>" +
            "<td>" + dataEndTime + "</td>" +
            "<td>" + "配置完成未取数据" + "</td>" +
            "</tr>";
        $("#jizuTable tbody").prepend(row);
        $("#jizuTable tr").unbind("click");
        $("#jizuTable tr").click(function () {
            $("#jizuTable td").removeClass('rowselect');
            $(this).children('td').addClass('rowselect');
        });
    }, "json");


};
//机组信息删除按钮点击事件
function deleteRow() {
    if ($(".rowselect").length < 1) {
        alert("未选择要删除的机组信息");
        return;
    }

    if ($(".rowselect").length > 0) {

        if ($(".rowselect").eq(6).text() == "配置完成未取数据") {
            $('#delQuery').modal('show');
        }
        else {
            $('#delQuery').modal('hide');
            alert("机组当前状态不能进行删除操作");
        }
    }
    
};
//机组信息删除提示框确实点击事件
function delMachineOK() {

    if ($(".rowselect").length > 0) {
            var temp = $(".rowselect").first().parent()[0].id;
            if (temp != null) {
                $.post("/delMachine", { "id": temp }, function (result) {
                    $(".rowselect").first().parent().remove();
                }, "json");
                $('#delQuery').modal('hide');
            }
    
            $('#delQuery').modal('hide');
    }

};

//机组信息数据迁移按钮点击事件
function machineLoadData() {
    if ($(".rowselect").length < 1) {
        alert("未选择要进行数据迁移的机组信息");
        return;
    }

    if ($(".rowselect").length > 0) {

        if ($(".rowselect").eq(6).text() == "配置完成未取数据") {
            var temp = $(".rowselect").first().parent()[0].id;
            if (temp != null) {
                $.post("/loadData", { "id": temp }, function (result) {
                    //设定值
                    $(".rowselect").eq(6).text(result);
                }, "json");
            }
        }
        else {
            alert("数据已迁移");
        }
    }
}
//机组表格数据初始化
function initMachineTable() {
    $.get("getMachines", function (result) {

        for (var i = 0; i < result.length; i++) {
            var row = "<tr id=" + result[i]["id"] + ">" +
                "<td>" + result[i]["name"] + "</td>" +
                "<td>" + result[i]["host"] + "</td>" +
                "<td>" + result[i]["port"] + "</td>" +
                "<td>" + result[i]["dbname"] + "</td>" +
                "<td>" + result[i]["datastarttime"] + "</td>" +
                "<td>" + result[i]["dataendtime"] + "</td>" +
                "<td>" + result[i]["status"] + "</td>" +
                "</tr>";

            $("#jizuTable tbody").append(row);

        }
        $("#jizuTable tr").click(function () {
            $("#jizuTable td").removeClass('rowselect');
            $(this).children('td').addClass('rowselect');
        });
    });
};
//图表数据初始化
function initChart() {
    $.get("getjizhu", function (result) {
        var xData = new Array();
        var yData = new Array();

        for (var i = 0; i < result.length; i++) {
            xData.push(result[i]["COL 1"]);
            yData.push(result[i]["COL 2"]);
        }

        var myChart = echarts.init(document.getElementById('chart'));
        // 指定图表的配置项和数据
        var option = {
            xAxis: {
                type: 'category',
                data: xData
            },
            yAxis: {
                type: 'value',
            },
            series: [{
                data: yData,

                type: 'line'
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    });
    // 基于准备好的dom，初始化echarts实例
};

//机组信息输入信息值检查
function machineInputCheck() {

    //机组名检查
    $("#jizuName").on('blur', function () {
        var str = $('#jizuName').val();
        var ret = checkSpecialChar(str);
        if (ret == false) {
            $("#jizuNameErr").html("机组名含有特殊字符");
        }
        if (str.indexOf(" ") != -1) {
            $("#jizuNameErr").html("机组名含有空格");
        }
    });
    $("#jizuName").on('focus', function () {
        $('#jizuNameErr').html("");
    });
    //机组HOST检查
    $("#jizuURI").on('blur', function () {
        var str = $('#jizuURI').val();
        var ret = checkIP(str);
        if (ret == false) {
            $("#jizuURIErr").html("不是合法的IP地址");
        }
    });
    $("#jizuURI").on('focus', function () {
        $('#jizuURIErr').html("");
    });
    //机组端口号检查
    $("#jizuPort").on('blur', function () {
        var str = $('#jizuPort').val();
        var ret = checkPort(str);
        if (ret == false) {
            $("#jizuPortErr").html("不是合法的端口号");
        }
    });
    $("#jizuPort").on('focus', function () {
        $('#jizuPortErr').html("");
    });
    //数据库名字检查
    $("#dbName").on('blur', function () {
        var str = $('#dbName').val();
        var ret = checkSpecialChar(str);
        if (ret == false) {
            $("#dbNameErr").html("机组名含有特殊字符");
        }
        if (str.indexOf(" ") != -1) {
            $("#dbNameErr").html("机组名含有k空格");
        }
    });
    $("#dbName").on('focus', function () {
        $('#dbNameErr').html("");
    });
};

//特殊字符检查
function checkSpecialChar(val) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%]");
    var result = val.match(pattern);
    if (!result) {
        return true;
    } else {
        return false;
    }
};

//IP地址判断
function checkIP(ipStr) {
    if (typeof ipStr == "undefined" || ipStr == null || ipStr == "") {
        return true;
    }
    //ip地址  
    var exp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var reg = ipStr.match(exp);
    if (reg == null) {
        return false;
    }
    else {
        return true
    }
};

//端口号判断
function checkPort(port) {
    if (typeof port == "undefined" || port == null || port == "") {
        return true;
    }
    //端口号需为数字 在0-65535之间
    if (!(/^[1-9]\d*$/.test(port) && 1 <= 1 * port && 1 * port <= 65535)) {
        return false
    }
    return true;
};

//日期时间选择控件初始化
function initDateTimeCtr() {

    layui.use('laydate', function(){
        var laydate = layui.laydate;

        laydate.render({
            elem: '#dataStartTime',
            type: 'datetime',
            done: function (value, date, endDate) {
                if (dataTimeCompare(1, value) == false) {
                    $("#dataStartTimeErr").html("数据采集开始时间不能大于数据采集结束时间");
                }
            },
            ready: function (date) {
                $("#dataStartTimeErr").html("");
            }
        });
    
        laydate.render({
            elem: '#dataEndTime',
            type: 'datetime',
            done: function (value, date, endDate) {
                if (dataTimeCompare(2, value) == false) {
                    $("#dataStartTimeErr").html("数据采集开始时间不能大于数据采集结束时间");
                }
            },
            ready: function (date) {
                $("#dataStartTimeErr").html("");
            }
        });
    });
    

    
};

function dataTimeCompare(flag, value) {
    var start;
    var end;
    if (flag == 1) {
        start = value;
        end = $('#dataEndTime').val();
    } else if (flag == 2) {
        start = $('#dataStartTime').val();
        end = value;
    }
    if (new Date(start) > new Date(end)) {

        return false;
    }
    return true;
};
