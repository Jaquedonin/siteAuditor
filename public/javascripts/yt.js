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
                        snippet.thumbnails.default.url,
                        snippet.channelTitle,
                        snippet.title,
                        snippet.description
                    );
                    
                    toggleYtPreview(true);

                    

                }, function(err) { console.error("Yt:", err); });
              
            }      
        })

        document.getElementById('yt-add').addEventListener("click", function(e){
            e.preventDefault();
            
            var formValues = $("#yt-form").serializeArray();
            console.log(); 
            $.ajax({
                url: "/videos",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(formValues),
                contentType: "application/json",
                cache: false,
                timeout: 5000,
                complete: function(data) {
                  //called when complete
                  console.log('process complete', data);
                },
            
                success: function(data) {
                  console.log('process sucess', data);
                },
            
                error: function(data) {
                  console.log('process error', data);
                },
            });
            
            toggleYtPreview();
            return false;
        });

        document.getElementById('yt-cancel').addEventListener("click", function(){
            toggleYtPreview();
            return false;
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

    function fillYtForm(thumb, name, title, desc){
        document.getElementById("yt-thumb").src = thumb ? thumb : "";
        document.getElementById("yt-name").value = name ? name : "";
        document.getElementById("yt-title").value = title ? title : "";
        document.getElementById("yt-desc").value = desc ? desc : "";
    }
});