var gCell;
$(document).ready(function () {

    //机组表格数据初始化
    initMachineTable();
    //图表信息初始化
    initChart();
    //算法表格双击表格事件
    calRowDbClick();

    //左侧边栏点击事件
    leftPanelClick();
    $("#machine").hide();
    $("#calculation").hide();
    $("#chart").show();
});

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
function leftPanelClick(){

    $("#left-panal a").click(function () {
        var temp = $(this);
        console.log("--------left-panal------" + $(this));
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
    var jizuName = $("#jizuName").val();
    var jizuURI = $("#jizuURI").val();
    var jizuPort = $("#jizuPort").val();
    var dataStartTime = $("#dataStartTime").val();
    var dataEndTime = $("#dataEndTime").val();
    var dbName = $("#dbName").val();
    var row = "<tr>" +
        "<td>" + jizuName + "</td>" +
        "<td>" + jizuURI + "</td>" +
        "<td>" + jizuPort + "</td>" +
        "<td>" + dbName + "</td>" +
        "<td>" + dataStartTime + "</td>" +
        "<td>" + dataEndTime + "</td>" +
        "<td>" + "已配置数据未迁移" + "</td>" +
        "</tr>";

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
        console.log('----------result--------' + result);
    }, "json");
    $("#jizuTable tbody").prepend(row);

};
//机组表格数据初始化
function initMachineTable() {
    $.get("getMachines", function (result) {


        for (var i = 0; i < result.length; i++) {
            var row = "<tr>" +
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