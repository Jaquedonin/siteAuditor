get("javascripts/cidades.json", initMapa);

function initMapa(cidades){
    var mapa = document.getElementById("municipios");
    if(mapa){ 
        var cidadesMapa = mapa.children;

        for (var posicao in cidadesMapa){
            var cidade = cidadesMapa[posicao];
            if(typeof(cidade) == "object"){
                
                cidade.setAttribute("data-original-title", cidades[cidade.id]);
                
                cidade.addEventListener("click", function(event){
                    toggleGaleria(event.target.id);
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
            $( "#select-cidade" ).val( ui.item.label );
            toggleGaleria(ui.item.value);
            return false;
        },
        open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        },
        focus: function(event, ui) {
            $( "#select-cidade" ).val( ui.item.label );
            return false;
        }
    });

    $(".mapa-info-btn").on("click", toggleMapaInfo)

}

function toggleGaleria(cidade){
    
    var galeria = document.getElementById("galeria-mapa");
       
    cidadeAnterior = galeria.dataset.cidade;
   
    var toggled = galeria.getAttribute("class") == "show";   

    //se clique for no botão de fechar ou na cidade selecionada, esconde galeria
    if(!cidade || (toggled && cidade == cidadeAnterior)){
        galeria.setAttribute("class", "");
        galeria.setAttribute("data-cidade", "");
    } else {
        
        post("galeria", {"cidade": cidade}, function(response){
            
            if(!toggled)
                galeria.setAttribute("class", "show");
        
            document.getElementById(galeria.dataset.cidade).setAttribute("class", "btn");
            galeria.dataset.cidade = cidade;
    
            var cidadeToShow = document.getElementById(cidade);
            cidadeToShow.setAttribute("class", "btn selected");
            
            document.getElementById("galeria-mapa").innerHTML = response.html;
            
        }, false);
    }
}

function zoomIn(){
    document.getElementById("mapa").style.transform = "scale(1.3)"
    document.getElementById("mapa").style.zIndex = "2"
};

function zoomOut(){
    document.getElementById("mapa").style.transform = "scale(1)"
    setTimeout(function(){
        document.getElementById("mapa").style.zIndex = "0"
    }, 500);
};

var mapaInfoTimeOut = {};
function toggleMapaInfo(){
    
    var id = this.parentNode.id;
    var toggled = $("#" + id + " .mapa-info-text").hasClass("show");

    if(toggled){
        $("#" + id + " .mapa-info-text").removeClass("show");
        clearTimeout(mapaInfoTimeOut[id]);
    } else {
        $("#" + id + " .mapa-info-text").addClass("show");

        mapaInfoTimeOut[id] = setTimeout(function(){
            $("#" + id + " .mapa-info-text").removeClass("show");
        }, 2000);
    }
}