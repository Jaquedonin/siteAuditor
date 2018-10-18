window.addEventListener("load", function(){
    $( "#select-escola" ).autocomplete({
        source: function(request, response){
            post("/api/escolas", {
                term: request.term, 
                cidade: window.location.pathname.split("/")[2]
            }, response)
        },
        select: function( event, ui ) {
            console.log(ui)
            $( "#select-escola" ).val( ui.item.label );
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
})