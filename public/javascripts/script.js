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

function visualizarVideoDashboard(id){
    get("/video-dashboard/" + id, function (response) {
        $("#visualizar-video").html(response.html);
        $("#visualizar-video").modal("show");
    })
}

function visualizarVideo(id){
    get("/video/" + id, function (response) {
        $("#visualizar-video").html(response.html);
        $("#visualizar-video").modal("show");
    })
}

function visualizarVideoMuseu(id){

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
                localStorage.setItem("video", videoUrl + "?rel=0&autoplay=1");
                localStorage.setItem("video-id", matchYt[1]);
                localStorage.setItem("type", "yt");
            }
        });
        
        $("#visualizar-video").modal("show");
    });

}