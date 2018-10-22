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
                    openGaleria(event.target.id);
                });
            }
        }
        $('[data-toggle="tooltip"]').tooltip();
    }

    $( "#select-cidade" ).autocomplete({
        source: function(request, response){
            post("/api/cidades", {term: request.term}, response)
        },
        select: function( event, ui ) {
            console.log(ui)
            $( "#select-cidade" ).val( ui.item.label );
            openGaleria(ui.item.value);
            return false;
        },
        open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
      });

}

function openGaleria(cidade){
    toggleGaleria(false);  
    post("galeria", {"cidade": cidade}, function(response){
        setTimeout(function(){
            document.getElementById("galeria-mapa").innerHTML = response.html;
            toggleGaleria(true); 
        }, 1000)
    }, false);
}

function toggleGaleria(show){
    var galeria = document.getElementById("galeria-mapa");
    var toggled = galeria.getAttribute("class") == "show";

    if(toggled && !show){
        galeria.setAttribute("class", "");
    } else {
        galeria.setAttribute("class", "show");
    }
}

function zoomIn(){
    document.getElementById("mapa").style.transform = "scale(1.3)"
};

function zoomOut(){
    document.getElementById("mapa").style.transform = "scale(1)"
};