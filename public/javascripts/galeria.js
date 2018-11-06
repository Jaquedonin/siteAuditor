window.addEventListener("load", function(){
    $( "#select-escola" ).autocomplete({
        source: function(request, response){
            post("/api/escolas", {
                term: request.term, 
                cidade: window.location.pathname.split("/")[2]
            }, response)
        },
        select: function( event, ui ) {
            $( "#select-escola" ).val( ui.item.label );
            
            var path = window.location.pathname.split("/");
            path[3] = ui.item.value;

            window.location = window.location.origin + path.join("/");
            return false;
        },
        open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        },
        focus: function(event, ui) {
            $( "#select-escola" ).val( ui.item.label );
            return false;
        }
    });

    var menuCategorias = document.getElementById("categorias");
    var n = 1;
    menuCategorias.childNodes.forEach(function(item){

        categorias[item.getAttribute("data-categoria")] = {
            n: n,
            item: item,
            selected: item.getAttribute("data-selected")
        }

        if(item.getAttribute("data-selected") == "1") {
            categorias["selected"] = item.getAttribute("data-categoria"); 
        }

        n++;
    });

})

function loadCategoria(categoria, proximoId){
    
    var path = window.location.pathname.split("/");
    path[4] = categoria;
    
    post(window.location.origin + path.join("/"), {carrossel: true}, function(response){
        setTimeout(function(){
            document.getElementById(proximoId).innerHTML = response.html;
            moveCarrossel(categoria); 
        }, 1000)
    }, false);
}

var categorias = {};
function moveCarrossel(categoria){
    console.log(categorias);
    var atual = categorias[categorias.selected];
    var proximo = categorias[categoria];

    console.log(atual, proximo)

    atual.item.setAttribute("class", "nav-item");
    atual.selected = 0;

    proximo.item.setAttribute("class", "nav-item selected");
    proximo.selected = 1;

    categorias.selected = categoria;

    var secoesCategorias = document.getElementById("categoria");

    var anterior = document.getElementById("categoria-anterior");
    var principal = document.getElementById("categoria-principal");
    var seguinte = document.getElementById("categoria-seguinte");

    if(atual.n > proximo.n){
        console.log("left");
        
        anterior.style.left = "0%"; 
        principal.style.left = "135%";
        seguinte.style.left = "200%";

        setTimeout(function(){

            secoesCategorias.removeChild(seguinte);
            
            principal.id = "categoria-seguinte";
            anterior.id = "categoria-principal";

            anterior = document.createElement("div");
            anterior.id = "categoria-anterior";

            secoesCategorias.appendChild(anterior);
            
        }, 1000);
        
    } else if(atual.n < proximo.n){
        
        anterior.style.left = "-200%"; 
        principal.style.left = "-135%";
        seguinte.style.left = "0%";

        setTimeout(function(){

            secoesCategorias.removeChild(anterior);
            
            principal.innerHTML = "";
            principal.id = "categoria-anterior";
            seguinte.id = "categoria-principal";
            
            seguinte = document.createElement("div");
            seguinte.id = "categoria-seguinte";
    
            secoesCategorias.appendChild(seguinte);
            
        }, 1000);
    }
}


function carrossel(categoria){

    var atual = categorias[categorias.selected];
    var proximo = categorias[categoria];

    if(atual.n > proximo.n){
        var proximoId = "categoria-anterior";
    } else if(atual.n < proximo.n){
        var proximoId = "categoria-seguinte"
    }

    loadCategoria(categoria, proximoId);

}