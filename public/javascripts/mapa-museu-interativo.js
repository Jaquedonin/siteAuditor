var modal;
var player;

window.addEventListener("load", function(){
    modal = $("#modal-play-video");
    
    if(!modal.length)
    return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        modal.modal("hide");
        
        if(e.key == "video"){
            
            $("#iframe-play-video").attr("src", e.newValue);
            
            var regExprYt = /https:\/\/youtube\.com\/embed\/(.*)(\?.*)/;
            var regExprFb = "http(?:s?):\/\/(?:www\.)?facebook\.com\/(?:.*\/)(?:videos\/)(.*)(?:\/)";
    
            var matchYt = e.newValue.match(regExprYt);
            var matchFb = e.newValue.match(regExprFb);

            console.log(matchYt);

            if(matchYt){
                player = new YT.Player('iframe-play-video', {
                    height: '390',
                    width: '640',
                    videoId: matchYt[2],
                    events: {
                        'onStateChange': ytStateChange
                    }
                });
            }

            modal.modal("show");
        }
        
    });
})

function ytStateChange(event) {
    console.log(event);
    if (event.data == YT.PlayerState.PLAYING) {
        setTimeout(stopVideo, 6000);
    }
}

function stopVideo(){
    // modal.modal("hide");
}

function visualizarVideo(id){

    get("/video-museu/" + id, function (response) {
        
        $("#visualizar-video").html(response.html);

        $("#trigger-play-video").on("click", function(e){
            var videoUrl = $(e.target).attr("data-video");
            localStorage.setItem("video", videoUrl + "?enablejsapi=1");
        });
        
        $("#visualizar-video").modal("show");
    });

}