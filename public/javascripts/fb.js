window.onload = function(){
    var formVideoUpload = document.getElementById("video-upload");

    setFbUser();
    
    $('#modal-videos').on('show.bs.modal', function () {
        getFbUserVideos();
    });

    if(formVideoUpload){

        formVideoUpload.addEventListener("submit", function(e){ 
            e.preventDefault();
            
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    alert("Video adicionado com sucesso!");
                    formVideoUpload.reset();
                    $('#modal-videos').modal("hide");
                    $('.modal-backdrop').remove();
                }
            };
            
            var formData = new FormData(formVideoUpload);
            var values = "";
            
            for (var pair of formData.entries()) {
                values += pair[0] + "=" + pair[1] + "&";
            }

            xhttp.open("POST", "salvar-upload.php", true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(values);

            return false;
        });
    }
}

function getFbUserVideos(){
    
    var fbUserVideos = document.getElementById("fb-user-videos");
    fbUserVideos.innerHTML = "";

    FB.api('me/feed', {fields: "permalink_url,description,link,picture"}, function(response){
        var feed = response.data;
        feed.forEach(function(post){
            if(post.link){
                
                var wrapVideo = document.createElement("div");
                wrapVideo.setAttribute("class", "col-6");

                var video = document.createElement("div");
                video.setAttribute("class", "video container");

                wrapVideo.appendChild(video);

                fbUserVideos.appendChild(wrapVideo);

                var thumbnail = document.createElement("img");
                video.style.backgroundImage = "url('" + post.picture + "')";

                var fade = document.createElement("div");
                
                var add = document.createElement("i");
                add.setAttribute("class", "fas fa-play");
                
                video.appendChild(fade);                
                video.appendChild(add);
            }
        });
    });
    
    return;
}

var emberLink = function(url){
    return "https://www.facebook.com/plugins/video.php?href="+encodeURI(url)+"&width=500&show_text=false&height=280&appId";
}

function setFbUser(){
    FB.getLoginStatus(
        function(response) {
            if(response.status === 'connected'){
                FB.api('me?fields=id,picture,name,posts.limit(1){permalink_url,description,link}', function(response){
                    fbUser = response;

                    $("#fb-login-user").val(fbUser.id);
                    $("#fb-register-user").val(fbUser.id);

                    fbPhoto = fbUser.picture.data ? fbUser.picture.data.url : "";
                    $("#fb-name").val(fbUser.name);
                    $("#fb-photo").val(fbPhoto);

                    // var dashboardMenuItem = '<li class="nav-item"><a class="nav-link" href="dashboard">Painel de gerencimaneto</a></li>';
                    var fbPhotoMenuItem = '<div id="fb-login"><img src='+fbPhoto+'></a>';
                    
                    $($("#fb-login")).append(fbPhotoMenuItem);
                    $("#fb-login-btn").remove();  
                    
                    $($("#fb-register")).append(fbPhotoMenuItem);
                    $("#fb-register-btn").remove();                
                });
            }
        }
    );
}

