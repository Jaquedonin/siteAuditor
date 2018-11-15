window.addEventListener("load", function(){
    localStorage.setItem("aba", true);

    window.addEventListener('storage', function(e) {
        $("#visualizar-video").modal("hide");
        if(e.key == "video"){
            exibirVideoModal(e.newValue);
        }
    });
})

function exibirVideoModal(id){
    get("/video-aba/" + id, function (response) {
        $("#visualizar-video").html(response.html);
        $("#visualizar-video").modal("show");
    })
}
