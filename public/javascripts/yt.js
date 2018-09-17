window.addEventListener("load", function(){
    gapi.client.setApiKey("AIzaSyA_l5mfOIWiR437wfKU3fU-8c2FS36uf48");
    gapi.client.load("youtube", "v3", function(){

        document.getElementById('yt-btn').addEventListener("click", function(){
            var url = document.getElementById('yt-link').value;
            if(url.match("[\?&]v=([^&#]*)") != null){
                videoId = url.match("[\?&]v=([^&#]*)")[1];
                
                return gapi.client.youtube.videos.list({
                    "part": "snippet",
                    "id": videoId
                }).then(function(response) {
                    var snippet = response.result.items[0].snippet;
                    
                    var ytPreview = document.getElementById("yt-preview");
                    ytPreview.setAttribute("class", "col-12 show");

                    var ytThumb = document.getElementById("yt-thumb");
                    ytThumb.src = snippet.thumbnails.default.url;
                    
                    var ytName = document.getElementById("yt-name");
                    ytName.value = snippet.channelTitle;

                    var ytTitle = document.getElementById("yt-title");
                    ytTitle.value = snippet.title;

                    var ytDesc = document.getElementById("yt-desc");
                    ytDesc.value = snippet.description;

                }, function(err) { console.error("Yt:", err); });
              
            }      
        })
    })
});