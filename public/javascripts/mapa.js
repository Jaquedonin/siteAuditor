get("javascripts/cidades.json", initMapa);

function initMapa(nomes){
    var mapa = document.getElementById("municipios");
    if(mapa){ 

        var cidades = mapa.children;

        for (var posicao in cidades){
            var cidade = cidades[posicao];
            if(typeof(cidade) == "object"){
                
                cidade.setAttribute("data-original-title", nomes[cidade.id]);
                
                cidade.addEventListener("click", function(event){
                    openGalery(event.target.id);
                });
            }
        }

        $('[data-toggle="tooltip"]').tooltip();
        
        document.getElementById("close-cidade").addEventListener("click", function(){
            toggleGalery(false);
        });
    }

}

function openGalery(cidade){
    toggleGalery(false);  
    post("galeria", {"cidade": cidade}, function(response){
        setTimeout(function(){
            document.getElementById("galery").innerHTML = response.html;
            toggleGalery(true); 
        }, 1000)
    }, false);
}

function toggleGalery(show){
    var galery = document.getElementById("galery");
    var toggled = galery.getAttribute("class") == "show";

    if(toggled && !show){
        galery.setAttribute("class", "");
    } else {
        galery.setAttribute("class", "show");
    }
}