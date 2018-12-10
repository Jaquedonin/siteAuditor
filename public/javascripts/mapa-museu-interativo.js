var ytPlayer, fbPlayer, fbEventHandler;
window.addEventListener("load", function(){
    var players = $("#yt-player, #fb-player");
    
    if(!players.length)
        return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        if(e.key == "video"){
            
            onStopYtVideo();
            onStopFbVideo();

            var video = JSON.parse(e.newValue);

            var isYt = video.type == "yt";
            var isFb = video.type == "fb";
            
            if(isYt){


                ytPlayer = new YT.Player('yt-player', {  
                    width: "100%",
                    height: "100%",
                    videoId: video.id,
                    events: {
                        'onReady': onReadyYtVideo,
                        'onStateChange': onStopYtVideo
                    }
                });
            }
            
            if(isFb){             

                $("#fb-player").html("<div id='fb-player-video' class='fb-video'></div>");

                $("#fb-player-video").attr("data-href", "https://www.facebook.com/video/video.php?v="+ video.id);
                $("#fb-player-video").attr("data-show-text", "false");
                $("#fb-player-video").attr("data-allowfullscreen", "true");
                $("#fb-player-video").attr("data-autoplay", "true");

                $("#fb-player-video").css("width", window.innerHeight + "px");
                $("#fb-player-video").css("height", window.innerHeight + "px");

                FB.XFBML.parse();
            }
            
        }
        
    });
})

function onReadyYtVideo(event){
    $("#yt-player").css("opacity", 1);
    event.target.playVideo();
}

function onStopYtVideo(event){
    if (event && event.data == YT.PlayerState.ENDED || (!event && ytPlayer)){
        $("#yt-player").css("opacity", 0);

        setTimeout(function(){
            ytPlayer.destroy();
            ytPlayer = null;
        }, 1000);
    }
}

var fbEventHandler
function onReadyFbVideo(){          
    $("#fb-player").css("opacity", 1);
    fbPlayer.unmute();
    fbEventHandler = fbPlayer.subscribe('finishedPlaying', onStopFbVideo);
}

function onStopFbVideo(){
    if(fbPlayer){
        fbPlayer.mute();  
        $("#fb-player").css("opacity", 0);
    }
}