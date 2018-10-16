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
    }

    $( "#select-cidade" ).autocomplete({
        source: function(request, response){
            post("/api/cidades", {term: request.term}, response)
        },
        select: function( event, ui ) {
            console.log(ui)
            $( "#select-cidade" ).val( ui.item.label );
            openGalery(ui.item.value);
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

function zoomIn(){
    document.getElementById("mapa").style.transform = "scale(1.3)"
};

function zoomOut(){
    document.getElementById("mapa").style.transform = "scale(1)"
};