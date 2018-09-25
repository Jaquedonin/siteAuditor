get("cidades.json", initGaleria);

function initGaleria(cidades){
    
    var cidadeId = window.location.search.replace("?", "");
    var cidadeNome = cidades[cidadeId];
    
    document.getElementById("nome-municipio").innerHTML = cidadeNome;
    
    get("fb-videos.json", function(galeria) {
        galeria.forEach(function(video){
            if(video['cidade'] == cidadeId){
                
                var wrapVideo = document.createElement("div");
                wrapVideo.setAttribute("class", "wrapper");

                var url = "https://www.facebook.com/" + video.user + "/videos/"+ video.id + "/";
                
                var previewVideo = document.createElement("iframe");
                previewVideo.setAttribute("controls", true);
                previewVideo.setAttribute('src', emberLink(url));

                var descrCidade = document.createElement("p");
                descrCidade.innerHTML = cidadeNome;
                var descrEscola = document.createElement("p");
                descrEscola.innerHTML = video.escola;

                wrapVideo.appendChild(previewVideo);
                wrapVideo.appendChild(descrCidade);
                wrapVideo.appendChild(descrEscola);

                videos.appendChild(wrapVideo);
            }
        });
    });
}