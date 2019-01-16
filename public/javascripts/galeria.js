window.addEventListener("load", function(){
    
    // inicializar select2 nos campos de busca
    $("#select-rede").select2(getSelect2Args({placeholder: 'Rede'}));
    
    $("#select-escola").select2(getSelect2Args({
        getQuery: function(){ 
            return {
                rede_id: $("#select-rede").val(),
                cidade_id: window.location.pathname.split("/")[2] 
            }
        },
        placeholder: 'Escolas',
        url: '/api/escolas',
    }));

    $("#select-escola").on("change", function(e){
        var path = window.location.pathname.split("/");
        
        var value = e.target.value;
        if(!value){ 
            path[3] = "todas";
        } else {
            path[3] = value;
        }
        
        $("#busca-galeria").attr("action", window.location.origin + path.join("/"));
    });
    
    $("#busca-galeria-submit").on("click", function(e){
        var form = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
        form.submit();
    });
    
    //carousel
    $($('#categorias').children()[0]).addClass("selected");
    $($('#categoria .carousel-inner').children()[0]).addClass("active");

    $('#categoria').on('slide.bs.carousel', function (e) {
            $($("#categorias").children()[e.from]).removeClass("selected")
            $($("#categorias").children()[e.to]).addClass("selected")
    })

    $("#visualizar-video").on("hidden.bs.modal", function(){
        if($("#trigger-play-video").length)
            localStorage.setItem("video", false);
        
        $("#visualizar-video").html("");  
    });

})
