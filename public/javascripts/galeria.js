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
})