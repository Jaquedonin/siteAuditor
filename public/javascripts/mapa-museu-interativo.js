var ytPlayer, fbPlayer;
window.addEventListener("load", function(){
    var players = $("#yt-player, #fb-player");
    
    if(!players.length)
        return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        if(e.key == "video"){
            
            var isYt = localStorage.getItem("type") == "yt";
            var isFb = localStorage.getItem("type") == "fb";
            
            if(isYt){
                ytPlayer = new YT.Player('yt-player', {  
                    width: "100%",
                    height: "100%",
                    videoId: localStorage.getItem("video-id"),
                    events: {
                        'onReady': onReadyYtVideo,
                        'onStateChange': onStopYtVideo
                    }
                });
            }
            
            if(isFb){
                
            }
            
        }
        
    });
})

function onReadyYtVideo(event){
    $("#yt-player").css("opacity", 1);
    event.target.playVideo();
}

function onStopYtVideo(event){
    if (event.data == YT.PlayerState.ENDED){
        $("#yt-player").css("opacity", 0);

        setTimeout(function(){
            ytPlayer.destroy();
            ytPlayer = null;
        }, 1000);
    }
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