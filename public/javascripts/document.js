var gCell ;
$(document).ready(function () {

    
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chart'));

    // 指定图表的配置项和数据
    var option = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

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


    $("#cal-table td").dblclick(function(){
        gCell = $(this)
        var temp = $(this);
        
        var row = $(this).parent().index() + 1; // 行位置
　　    var col = $(this).index() + 1; // 列位置
　　    //alert("当前位置：第"+row+"行，第"+col+"列")

        if (col == 2){

            $('#myModal').modal('show');
        }
    
        
    });

});


function submitCal(){
    var selText = $("#cal-select option:selected").text();
    gCell.text(selText);
    $('#myModal').modal('hide');
};