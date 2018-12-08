var iframe;
var player;

window.addEventListener("load", function(){
    var iframe = $("#iframe-play-video");
    
    if(!iframe.length)
        return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        if(e.key == "video"){
            iframe.attr("src", e.newValue);
            iframe.css("opacity", 1);
        }
        
    });
})

function onStopVideo(){
    iframe.attr("src", "");
    iframe.css("opacity", 0);
}