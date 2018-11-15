function get(url, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if ((request.readyState == 4) && (request.status == 200))
            onsuccess(JSON.parse(request.response));
    }

    request.open("GET", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send();
}

function post(url, send, onsuccess) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if ((request.readyState == 4) && (request.status == 200))
            onsuccess(JSON.parse(request.response));
    }

    request.open("POST", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.send(JSON.stringify(send));
}

function visualizarVideo(id){
    get("/video/" + id, function (response) {
        $("#visualizar-video").html(response.html);

        if(localStorage.getItem("aba")){
            $("#play-video").on("click", function(e){
                var videoId = $(e.target).attr("data-video");
                localStorage.setItem("video", videoId);
            });
        } else {
            $("#play-video").css("display","none")
        }
        
        $("#visualizar-video").modal("show");
    })
}
