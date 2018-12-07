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
            $("#iframe-play-video").attr("src", e.newValue);
            modal.modal("show");
        }
        
    });
})

function onStopVideo(){
    modal.modal("hide");
}