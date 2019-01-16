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
                var video = {
                    url: videoUrl + "&allowfullscreen=true&autoplay=true&mute=0",
                    type: "fb",
                    id: matchFb[1]
                };
            }
            
            if(matchYt){
                var video = {
                    url:  videoUrl + "?rel=0&autoplay=1",
                    type: "yt",
                    id: matchYt[1]
                };
            }

            localStorage.setItem("video", JSON.stringify(video) );
        });
        
        $("#visualizar-video").modal("show");
    });
}

function getSelect2Args(args){

    var ajax;

    if(args.url){

        ajax = { 
            type: 'POST',
            dataType: 'json',
            url: args.url,
            data: function(params){
                var query = args.getQuery ? args.getQuery() : {};
                return { term: params.term, ...query };
            },
            processResults: function (data) {
                data.unshift({id:"", text:""})
                return {results: data};
            },
        }
    }

    return  {
        width: '100%',
        allowClear: true,
        placeholder: args.placeholder,
        disabled: args.disabled,
        data: args.data,
        ajax: ajax
    };
}