
var ytPlayer, fbPlayer;
window.addEventListener("load", function(){
    var players = $("#yt-player, #fb-player");
    
    if(!players.length)
        return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        if(e.key == "video"){
            
            var video = JSON.parse(e.newValue);

            var isYt = video.type == "yt";
            var isFb = video.type == "fb";
            
            console.log(video);

            if(isYt){
                ytPlayer = new YT.Player('yt-player', {  
                    width: "100%",
                    height: "100%",
                    videoId: video['video-id'],
                    events: {
                        'onReady': onReadyYtVideo,
                        'onStateChange': onStopYtVideo
                    }
                });
            }
            
            if(isFb){

                $("#fb-player-video").attr("data-href", video.url);
                $("#fb-player-video").css("width", window.innerHeight + "px");
                $("#fb-player-video").css("height", window.innerHeight + "px");
                $("#fb-player").css("opacity", 1);

                FB.Event.subscribe('xfbml.ready', function(msg) {
                    
                    if (msg.type === 'video') {
                        fbPlayer = msg.instance;
                        console.log(fbPlayer);
                    }   
                });

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