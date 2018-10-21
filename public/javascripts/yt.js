window.addEventListener("load", function(){
    
    var btn = document.getElementById('yt-btn');
        
    if(btn){
        btn.addEventListener("click", function(){
            var url = document.getElementById('yt-link').value;
            gapi.client.setApiKey("AIzaSyA_l5mfOIWiR437wfKU3fU-8c2FS36uf48");
            gapi.client.load("youtube", "v3", function(){
                getVideoInfo([url], function(info){
                    fillVideoForm(info);
                    toggleYtPreview(true);
                });
            });
                
        });

        document.getElementById('yt-add').addEventListener("click", toggleYtPreview);
        document.getElementById('yt-cancel').addEventListener("click", function(event){
            event.preventDefault();
            toggleYtPreview();
        });
    }      
    
    var galeriaYtVideo = document.getElementsByClassName('galeria-yt-video');
    if(galeriaYtVideo.length > 0){
        for(ytVideo in galeriaYtVideo){
            getYtVideo(ytVideo.getAttribute("data-url"));
        }
    }
});

function getVideoInfo(urls, onsuccess) {
    
    var regExprYt = "http(?:s?):\/\/(?:www\.)?youtu(be\.com\/watch[\?&]v=|\.be\/)([\\w\\-\\_]*|.)(&(amp;)[\w\=]*)?";
    var regExprFb = "http(?:s?):\/\/(?:www\.)?facebook\.com\/(?:.*\/)(?:videos\/)(.*)(?:\/)";
    
    urls.forEach(function(url){
        var matchYt = url.match(regExprYt);
        var matchFb = url.match(regExprFb);
    
        if(matchYt){
            gapi.client.youtube.videos.list({
                "part": "snippet",
                "id": matchYt[2]
            }).then(function(response){
                var snippet = response.result.items[0].snippet;
                return onsuccess({
                    url: url,
                    thumb: snippet.thumbnails.default.url,
                    name: snippet.channelTitle,
                    title: snippet.title,
                    description: snippet.description
                });
            });
        }

        if(matchFb){
            return FB.api(
                "/" + matchFb[1],
                {fields: ["permalink_url", "picture", "from", "title", "description"]},
                function (response) {
                    if (response && !response.error) {
                        return onsuccess({
                            url: response.permalink_url,
                            thumb: response.picture,
                            name: response.from.name,
                            title: response.title,
                            description: response.description
                        });
                    }
                }
            );
        }
    });

}

function toggleYtPreview(show){
    var ytPreview = document.getElementById("yt-preview");
    var toggled = ytPreview.getAttribute("class") == "col-12 show";

    if(toggled && !show){
        ytPreview.setAttribute("class", "col-12");
        setTimeout(fillVideoForm, 1000);
    } else {
        ytPreview.setAttribute("class", "col-12 show");
    }
}

function fillVideoForm(video){
    document.getElementById("yt-url").value = video.url;
    document.getElementById("yt-thumb").src = video.thumb;
    document.getElementById("yt-img").value = video.thumb;
    document.getElementById("yt-name").value = video.name;
    document.getElementById("yt-title").value = video.title;
    document.getElementById("yt-desc").value = video.description;
}
