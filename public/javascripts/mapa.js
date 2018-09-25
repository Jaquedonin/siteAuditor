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
                    openGallery(event.target.id);
                });
            }
        }

        $('[data-toggle="tooltip"]').tooltip()
    }

}

function openGallery(cidade){
    console.log(cidade);
    post("galeria", {"cidade": cidade}, function(response){
        console.log(response);
    });
}