var modal;
var player;

window.addEventListener("load", function(){
    modal = $("#modal-play-video");
    
    if(!modal.length)
    return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        //modal.modal("hide");
        
        if(e.key == "video"){
            console.log("play video", e.newValue);
            $("#iframe-play-video").attr("src", e.newValue);
            modal.modal("show");
        }
        
    });
})

function onStopVideo(){
    modal.modal("hide");
}

function visualizarVideo(id){

    get("/video-museu/" + id, function (response) {
        
        $("#visualizar-video").html(response.html);


        $("#trigger-play-video").on("click", function(e){
            var videoUrl = $(e.target).attr("data-video");


            var regExprYt = /https:\/\/youtube\.com\/embed\/(.*)/;
            var regExprFb = /https:\/\/www\.facebook\.com\/video\/embed\?video_id=([0-9]*)/;
            
            var matchYt = videoUrl.match(regExprYt);
            var matchFb = videoUrl.match(regExprFb);

            if(matchFb){
                localStorage.setItem("video", videoUrl );
                localStorage.setItem("type", "fb");
            }

            if(matchYt){
                console.log("Video youtube");
                localStorage.setItem("video", videoUrl + "?rel=0&autoply=1");
                localStorage.setItem("video-id", matchYt[1]);
                localStorage.setItem("type", "yt");
            }
        });
        
        $("#visualizar-video").modal("show");
    });

}