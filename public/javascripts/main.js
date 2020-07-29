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
    //机组信息输入信息值检查
    machineInputCheck();
    //日期时间选择控件初始化
    initDateTimeCtr();
   
});

