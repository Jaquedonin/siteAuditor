get("javascripts/cidades.json", initMapa);

async function initMapa(cidades){
    
    //aguardar adicionar meso região às respectivas cidades de acordo com o json
    var mesoregioes = await get("javascripts/mesoregioes.json", defineMesoregioes);

    var mapa = document.getElementById("municipios");
    if(mapa){ 
        var cidadesMapa = mapa.children
        var options = [{id: "", value:""}];

        for (var posicao in cidadesMapa){
            var cidade = cidadesMapa[posicao];
            
            if(typeof(cidade) == "object"){
                
                cidade.setAttribute("data-original-title", cidades[cidade.id]);
                
                cidade.addEventListener("click", function(event){
                    toggleGaleria(event.target.id);
                });

                options.push({
                    id: cidade.id,
                    text: cidades[cidade.id]
                })
            }
        }

        $("#select-cidade").select2(getSelect2Args({
            placeholder: 'Municípios',
            data: options
        }));
        
        $("#select-cidade").on("change", function(e){
            toggleGaleria(e.target.value);    
        });
        
        $('[data-toggle="tooltip"]').tooltip();
    }

    $("#visualizar-video").on("hidden.bs.modal", function(){
        $("#visualizar-video").html("");
    });
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
            document.getElementById("mesorregiao-nome").innerHTML = "";
            document.getElementById("mesorregiao-svg").src = "";
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
                document.getElementById("mesorregiao-nome").innerHTML = "";
                document.getElementById("mesorregiao-svg").src = "";
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
            document.getElementById("mesorregiao-nome").innerHTML = mesoToShow.dataset.title;
            document.getElementById("mesorregiao-svg").src = "/images/" + mesoToShow.dataset.title + ".svg";
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