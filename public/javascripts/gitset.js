$(document).ready(function () {

   

});

//生成连接GitHub需要的公钥
function genericGitKey(){
    var gitac = $("#gitAccount").val();
    $.post("/gitset/genkey", {"ac":gitac}, function (result) {
        $("#keyContent").text(result);  
    }, "json");
}

//通过克隆测试GitHub是否已经连通
function connectGitByClone(){

    var sshContent = $("#sshContent").val();
    var projectName = $("#projectName").val();
    var configFileName = $("#configFileName").val();
    var info ={
        ssh:sshContent,
        pname:projectName,
        conname:configFileName
    }

     $.post("/gitset/congit", info, function (result) {
         if (result == "ok"){
            alert("连通测试成功")
         }else{
            alert("连通测试失败")
         }
    }, "json");    
}
