window.addEventListener("load", function(){
    $( "#select-escola" ).autocomplete({
        source: function(request, response){
            post("/api/escolas", {
                term: request.term, 
                rede_id: $("#rede_id").val(),
                cidade: window.location.pathname.split("/")[2]
            }, response)
        },
        select: function( event, ui ) {
            $( "#select-escola" ).val( ui.item.label );
            
            var path = window.location.pathname.split("/");
            path[3] = ui.item.value;

            $("#busca-galeria").attr("action", window.location.origin + path.join("/"));
            $("#busca-galeria").submit();
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
        },
        change: function(event, ui){
           
            if(!ui.item){ 
                var path = window.location.pathname.split("/");
                path[3] = "todas";

                $("#busca-galeria").attr("action", window.location.origin + path.join("/"));
                $("#busca-galeria").submit();
            }
        }
    });

    $("#busca-galeria .input-group-append").on("click", function(e){
        var form = e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
        form.submit();
    });
    
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