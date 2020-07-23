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

    alert("btnGitCon git")
    
}
