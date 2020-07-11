var gCell;
$(document).ready(function () {

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


    $("#machine").hide();
    $("#calculation").hide();
    $("#chart").show();

    $("#li-machine").click(function () {
        $("#left-panal a").removeClass("active"); //移除
        $(this).addClass("active"); // 追加样式
        $("#machine").hide();
        $("#calculation").hide();
        $("#chart").hide();
        $("#machine").show();

    });

    $("#li-cal").click(function () {
        $("#left-panal a").removeClass("active"); //移除
        $(this).addClass("active"); // 追加样式
        $("#machine").hide();
        $("#calculation").hide();
        $("#chart").hide();
        $("#calculation").show();

    });

    $("#li-chart").click(function () {
        $("#left-panal a").removeClass("active"); //移除
        $(this).addClass("active"); // 追加样式
        $("#machine").hide();
        $("#calculation").hide();
        $("#chart").hide();
        $("#chart").show();

    });


    $("#cal-table td").dblclick(function () {
        gCell = $(this)
        var temp = $(this);

        var row = $(this).parent().index() + 1; // 行位置
        var col = $(this).index() + 1; // 列位置
        //alert("当前位置：第"+row+"行，第"+col+"列")

        if (col == 2) {

            $('#myModal').modal('show');
        }
    });

});


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
    
    // $.post("/addMachine", JSON.stringify(addInfo), function (result) {
    //     //$("span").html(result);
    //     console.log('----------result--------'+result);
    // },'json');
    console.log("----------"+JSON.stringify(addInfo) )
    $.post("/addMachine", addInfo,function (result) {
        //$("span").html(result);
        console.log('----------result--------'+result);
    },"json");
    $("#jizuTable tbody").prepend(row);

};