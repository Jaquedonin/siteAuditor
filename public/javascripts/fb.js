var fbUser, fbMenuItem, formVideoUpload;

window.onload = function(){
    formVideoUpload = document.getElementById("video-upload");

    var selectCidades = document.getElementById("select-cidades");

    var mapa = document.getElementById("municipio-svg");
    if(mapa){ 
        var cidades = mapa.children;

        for (var posicao in cidades){
            var cidade = cidades[posicao];
            if(typeof(cidade) == "object"){
                
                cidade.addEventListener("mouseover", function(event){
                    document.getElementById("nome-da-cidade").innerHTML = event.target.getAttribute("data-tooltip");
                });

                cidade.addEventListener("click", function(event){
                    window.location.href = "galeria.html?" + event.target.getAttribute("id");
                });

                var option = document.createElement("option");

                option.value = cidade.id; 
                option.innerHTML = cidade.getAttribute("data-tooltip");

                selectCidades.appendChild(option);
            }
        }
    }

    fbMenuItem = document.getElementById("fb-login");
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
        console.log(response);
        feed.forEach(function(post){
            if(post.link){
                console.log(post);
                
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

