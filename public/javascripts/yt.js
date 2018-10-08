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
                    
                    fillYtForm(
                        url,
                        snippet.thumbnails.default.url,
                        snippet.channelTitle,
                        snippet.title,
                        snippet.description
                    );
                    
                    toggleYtPreview(true);

                    

                }, function(err) { console.error("Yt:", err); });
              
            }      
        })

        document.getElementById('yt-add').addEventListener("click", function(){
            toggleYtPreview();
        });

        document.getElementById('yt-cancel').addEventListener("click", function(){
            toggleYtPreview();
        });
    })

    function toggleYtPreview(show){
        var ytPreview = document.getElementById("yt-preview");
        var toggled = ytPreview.getAttribute("class") == "col-12 show";

        if(toggled && !show){
            ytPreview.setAttribute("class", "col-12");
            setTimeout(fillYtForm, 1000);
        } else {
            ytPreview.setAttribute("class", "col-12 show");
        }
    }

    function fillYtForm(url, thumb, name, title, desc){
        document.getElementById("yt-url").value = url ? url : "";
        document.getElementById("yt-thumb").src = thumb ? thumb : "";
        document.getElementById("yt-name").value = name ? name : "";
        document.getElementById("yt-title").value = title ? title : "";
        document.getElementById("yt-desc").value = desc ? desc : "";
    }
});