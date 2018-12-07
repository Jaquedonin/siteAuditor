var modal;
var player;

window.addEventListener("load", function(){
    iframe = $("#modal-play-video");
    
    if(!iframe.length)
    return false;
    
    localStorage.clear();
    
    window.addEventListener('storage', function(e) {
        
        if(e.key == "video"){
            $("#iframe-play-video").attr("src", e.newValue);
        }
        
    });
})

function onStopVideo(){
    modal.modal("hide");
}