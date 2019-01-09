window.addEventListener("load", function(){
      
    gapi.client.setApiKey("AIzaSyA_l5mfOIWiR437wfKU3fU-8c2FS36uf48");
    gapi.client.load("youtube", "v3", function(){
        document.getElementById("insert-video-btn").addEventListener("click", previewVideo);
        document.getElementById("insert-video-link").addEventListener("input", previewVideo);
    });
    
    document.getElementById('insert-video-form').addEventListener("submit", validateVideo);

    document.getElementById('insert-video-cancel').addEventListener("click", function(event){
        event.preventDefault();
        toggleVideoPreview();
    });
    
    $("#visualizar-video").on("hidden.bs.modal", function(){
        $("#visualizar-video").html("");
    });

    $("#cadastrar-escola").on("hidden.bs.modal", function(){
        $("#cadastrar-escola form").trigger("reset");
    });

    $("#cadastrar-escola form").on("submit", function(e){ return cadastrarEscola(e); })

    $( "#select-cidade" ).autocomplete({
        source: function(request, response){
            post("/api/cidades", {term: request.term}, response)
        },
        search: function(){
            $("#select-escola").val("");
            $("#escola-id").val("");
            $("#select-escola").attr("readonly", true)
        },
        select: function( event, ui ) {

            $("#select-escola").val("");
            $("#escola-id").val("");

            if(ui.item.value){
                $("#select-escola").removeAttr("readonly")
            }

            $( "#select-cidade" ).val( ui.item.label );
            $( "#cidade-id" ).val( ui.item.value );
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
            $( "#cidade-id" ).val( ui.item.value );
            return false;
        }
    });

    $( "#select-escola" ).autocomplete({
        source: function(request, response){
            post("/api/escolas", {term: request.term, cidade: $("#cidade-id").val(), insert_escola: true}, response);
        },
        select: function( event, ui ) {

            if(ui.item.value == "+ Cadastrar nova escola"){
                modalCadastrarEscola(event.target.value);
                return false;

            }

            $( "#select-escola" ).val( ui.item.label );
            $( "#escola-id" ).val( ui.item.value );
            return false;
        },
        open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        },
        focus: function(event, ui) {
            if(ui.item.value > 0){
                $( "#select-escola" ).val( ui.item.label );
                $( "#escola-id" ).val( ui.item.value );
            }
            return false;
        }
    });

    $("#inputs-user-videos .input-group-append").on("click", function(e){
        var form = e.target.parentNode.parentNode.parentNode.parentNode;
        form.submit();
    });

    $( "#busca-cidade" ).autocomplete({
        source: function(request, response){
            post("/api/cidades", {term: request.term}, response)
        },
        search: function(){
            $("#busca-escola").val("");
            $("#busca-escola-id").val("");
            $("#busca-escola").attr("readonly", true)
        },
        select: function( event, ui ) {

            $("#busca-escola").val("");
            $("#busca-escola-id").val("");

            if(ui.item.value){
                $("#busca-escola").removeAttr("readonly")
            }

            $( "#busca-cidade" ).val( ui.item.label );
            $( "#busca-cidade-id" ).val( ui.item.value );
            return false;
            
        },
        open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        },
        focus: function(event, ui) {
            $( "#busca-cidade" ).val( ui.item.label );
            $( "#busca-cidade-id" ).val( ui.item.value );
            return false;
        },
        change: function(event, ui){

            if(!ui.item){
                $("#busca-cidade").val("");
                $("#busca-cidade-id").val("");  
                $("#busca-escola").val("");
                $("#busca-escola-id").val(""); 
            }
        }
    });

    $( "#busca-escola" ).autocomplete({
        source: function(request, response){
            post("/api/escolas", {
                term: request.term, 
                cidade: $("#busca-cidade-id").val(),
                rede_id: $("#rede_id").val()
            }, response);
        },
        select: function( event, ui ) {
            $( "#busca-escola" ).val( ui.item.label );
            $( "#busca-escola-id" ).val( ui.item.value );
            return false;
        },
        open: function() {
          $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
          $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        },
        focus: function(event, ui) {
            $( "#busca-escola" ).val( ui.item.label );
            $( "#busca-escola-id" ).val( ui.item.value );
            return false;
        },
        change: function(event, ui){

            if(!ui.item){  
                $("#busca-escola").val("");
                $("#busca-escola-id").val(""); 
            }

        }
    });

});

function validateVideo(e){
    var form = e.target;
    var valid = true;
    
    var values = [form.autor, form.titulo, form.descricao, form.cidade, form.escola, form.categoria_id];
    
    values.forEach(function(item){
        if(!item.value || item.value == 0){
            valid = false;
            $(item).addClass("is-invalid");
        } else {
            $(item).removeClass("is-invalid");
        }
    })
    
    if(!valid){
        e.preventDefault();
    }
}

function previewVideo(){
    var url = document.getElementById('insert-video-link').value;
    getVideoInfo([url], function(info){
        fillVideoForm(info);
        toggleVideoPreview(true);
    });
}

function getVideoInfo(urls, onsuccess) {
    
    var regExprYt = "http(?:s?):\/\/(?:www\.)?youtu(be\.com\/watch[\?&]v=|\.be\/)([\\w\\-\\_]*|.)(&(amp;)[\w\=]*)?";
    var regExprFb = "http(?:s?):\/\/(?:www\.)?facebook\.com\/(?:.*\/)(?:videos\/)(.*)(?:\/)";
    
    urls.forEach(function(url){

        var matchYt = url.match(regExprYt);
        var matchFb = url.match(regExprFb);

        if(!matchYt && !matchFb){
            
            if(url.length){
                $("#insert-video-link").addClass("is-invalid");
            }

            toggleVideoPreview(false);
            return;
        }

        $("#insert-video-link").removeClass("is-invalid");

        if(matchYt){
            return gapi.client.youtube.videos.list({
                "part": "snippet",
                "id": matchYt[2]
            }).then(function(response){
                var snippet = response.result.items[0].snippet;
                return onsuccess({
                    url: 'https://youtube.com/embed/' + matchYt[2],
                    thumb: snippet.thumbnails.high.url,
                    name: snippet.channelTitle,
                    title: snippet.title,
                    description: snippet.description
                });
            });
        }

        if(matchFb){
            return post(
                "api/fb/",
                { id: matchFb[1], fields: ["format,from,title,description"]},
                function (response) {
                    if (response) {

                        var lastFormat = response.format.length - 1;
                        return onsuccess({
                            url: "https://www.facebook.com/video/embed?video_id="+matchFb[1],
                            thumb: response.format[lastFormat].picture,
                            name: response.from.name,
                            title: response.title,
                            description: response.description
                        });
                    }
                }
            );
        }
    });
}

function toggleVideoPreview(show){
    var ytPreview = document.getElementById("video-preview");
    var toggled = ytPreview.getAttribute("class") == "col-12 show";

    if(toggled && !show){
        ytPreview.setAttribute("class", "col-12");
        fillVideoForm({});
    } else {
        if(show){
            ytPreview.setAttribute("class", "col-12 show");
        }
    }
}

function fillVideoForm(video){
    document.getElementById("insert-video-url").value = video.url ? video.url : "";
    document.getElementById("insert-video-thumb").src = video.thumb ? video.thumb : "";
    document.getElementById("insert-video-img").value = video.thumb ? video.thumb : "";
    document.getElementById("insert-video-name").value = video.name ? video.name : "";
    document.getElementById("insert-video-title").value = video.title ? video.title : "";
    document.getElementById("insert-video-desc").value = video.description ? video.description : "";
}

function modalCadastrarEscola(escola){
    $("#cadastrar-escola form #escola-nome").val(escola);
    $("#cadastrar-escola form #escola-cidade-nome").val($( "#select-cidade" ).val());
    $("#cadastrar-escola form #escola-cidade-id") .val($( "#cidade-id" ).val());
    $("#cadastrar-escola form #escola-rede-nome").val($( "#select-rede" ).val());
    $("#cadastrar-escola form #escola-rede-id") .val($( "#rede-id" ).val());
    $("#cadastrar-escola").modal("show");
}

function cadastrarEscola(e){

    post("/escola", 
        { 
            cidade_id: e.target.cidade_id.value,
            sigla: e.target.sigla.value,
            nome: e.target.nome.value,
            rede_id: e.target.rede_id.value,
        },
        function (response) {
            
            var formVideo = $("#video-preview form");
            var formEscola = $("#cadastrar-escola form");

            formVideo[0].escola.value = formEscola[0].nome.value;
            formVideo[0].escola_id.value = response.id;
            $(formVideo[0].escola).addClass("is-valid");
            $("#cadastrar-escola").modal("hide");
        }
    );

    return false;
}

function deleteVideo(e){
    e.stopPropagation();
    e.target.parentElement.submit();
}