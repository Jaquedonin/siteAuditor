get("javascripts/cidades.json", initMapa);

async function initMapa(cidades){

    //aguardar adicionar meso região às respectivas cidades de acordo com o json
    var mesoregioes = await get("javascripts/mesoregioes.json", defineMesoregioes);

    var mapa = document.getElementById("municipios");
    if(mapa){ 
        var cidadesMapa = mapa.children

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

function defineMesoregioes(mesoregioes){
    for(var meso in mesoregioes){
        mesoregioes[meso].forEach(function(item){
            document.getElementById(item).dataset.meso = meso;
        })
    }

    return true;
}

function toggleGaleria(cidade){
    
    var galeria = document.getElementById("galeria-mapa");
       
    cidadeAnterior = galeria.dataset.cidade;
   
    var toggled = galeria.getAttribute("class") == "show";   

    //se clique for no botão de fechar ou na cidade selecionada, esconde galeria
    if(!cidade || (toggled && cidade == cidadeAnterior)){
        galeria.setAttribute("class", "");
        
        //esconder meso região anterior
        if(galeria.dataset.meso){
            document.getElementById(galeria.dataset.meso).style.visibility = "hidden";
        }

        //esconder cidade anterior
        if(galeria.dataset.cidade){
            document.getElementById(galeria.dataset.cidade).setAttribute("class", "btn");
        }
        
        galeria.setAttribute("data-cidade", "");
    } else {
        
        post("galeria", {"cidade": cidade}, function(response){
            
            if(!toggled)
                galeria.setAttribute("class", "show");
        
            //esconder meso região anterior
            if(galeria.dataset.meso){
                document.getElementById(galeria.dataset.meso).style.visibility = "hidden";
            }

            //esconder cidade anterior
            if(galeria.dataset.cidade){
                document.getElementById(galeria.dataset.cidade).setAttribute("class", "btn");
            }

            //identificar cidade selecionada
            var cidadeToShow = document.getElementById(cidade);
            
            //identificar meso região selecionada
            var meso = cidadeToShow.dataset.meso;
            var mesoToShow = document.getElementById(meso);

            //salvar na galeria cidade e meso região selecionadas
            galeria.dataset.cidade = cidade;
            galeria.dataset.meso = meso;
    
            //exibir cidade e meso região selecionadas
            mesoToShow.style.visibility = "visible";
            cidadeToShow.setAttribute("class", "btn selected");
            
            //inserir conteúdo da galeria
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