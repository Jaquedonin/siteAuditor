var modal;

window.addEventListener("load", function(){
    modal = $("#modal-play-video");
    
    if(!modal.length)
    return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        modal.modal("hide");
        
        if(e.key == "video"){
            $("#iframe-play-video").attr("src", e.newValue);
            modal.modal("show");
        }
        
    });
})

function visualizarVideo(id){

    get("/video-museu/" + id, function (response) {
        
        $("#visualizar-video").html(response.html);

        $("#trigger-play-video").on("click", function(e){
            var videoUrl = $(e.target).attr("data-video");
            localStorage.setItem("video", videoUrl + "?autoplay=1&rel=0");
        });
        
        $("#visualizar-video").modal("show");
    });

}