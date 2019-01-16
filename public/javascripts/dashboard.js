window.addEventListener("load", function(){
      
    //iniciar api do youtube
    gapi.client.setApiKey("AIzaSyA_l5mfOIWiR437wfKU3fU-8c2FS36uf48");
    gapi.client.load("youtube", "v3", function(){
        document.getElementById("insert-video-btn").addEventListener("click", previewVideo);
        document.getElementById("insert-video-link").addEventListener("input", previewVideo);
    });
    
    //validar link do video ao clicar em adicionar vídeo
    document.getElementById('insert-video-form').addEventListener("submit", validateVideo);
    
    //fechar preview do video ao clicar em cancelar
    document.getElementById('insert-video-cancel').addEventListener("click", function(event){
        event.preventDefault();
        toggleVideoPreview();
    });
    
    //parar execução do vídeo ao fechar o modal de visualização
    $("#visualizar-video").on("hidden.bs.modal", function(){
        $("#visualizar-video").html("");
    });

    //formulário de adicionar vídeo
    $("#inputs-user-videos .input-group-append").on("click", function(e){
        var form = e.target.parentNode.parentNode.parentNode.parentNode;
        form.submit();
    });

    post("/api/escolas", {cidade: $("#busca-cidade").attr("value")}, initBuscaEscolas);
    post("/api/escolas", {cidade: $("#select-cidade").attr("value")}, initSelectEscolas);
    get("javascripts/cidades.json", initSelectBuscaCidades);
    
    //campo e cadastro de escola
    $("#cadastrar-escola form").on("submit", function(e){ return cadastrarEscola(e); })
    $("#cadastrar-escola").on("hidden.bs.modal", function(){
        $("#cadastrar-escola form").trigger("reset");
    });

});

function initSelectBuscaCidades(cidades){
    
    var options = [{id: "", text: ""}];
    for (var cidade in cidades){
        options.push({
            id: cidade,
            text: cidades[cidade]
        })
    }

    $("#select-cidade").select2(getSelect2Args({
        placeholder: 'Cidade',
        data: options
    }));
    
    $("#select-cidade").on("change", function(e){
        $("#select-escola").val("").trigger("change");
        $("#select-escola").attr({'disabled': !e.target.value }).trigger('change.select2');
    });
    
    $("#busca-cidade").select2(getSelect2Args({
        placeholder: 'Cidade',
        data: options
    }));

    $("#busca-cidade").val($("#busca-cidade").attr("value")).trigger("change");
    
    $("#busca-cidade").on("change", function(e){
        $("#busca-escola").val("").trigger("change");
    });
        
}

function initSelectEscolas(escolas, value){

    escolas.unshift({id: "", text: ""});

    var getQuery = function(){ 
        return {
            cidade_id: $("#select-cidade").val(),
            insert_escola: true
        }
    }; 

    $("#select-escola").select2(getSelect2Args({
        getQuery: getQuery,
        placeholder: 'Escola',
        url: '/api/escolas',
        data: escolas,
        disabled: !$("#select-cidade").val()
    }));

    $("#select-escola").on("change", function(e){
        if(e.target.value == "nova-escola"){
            modalCadastrarEscola();
        }
    });

    if(value){
        $("#select-escola").val(value).trigger("change");
    }
}

function initBuscaEscolas(escolas){
    
    escolas.unshift({id:"", text: ""});
    $("#busca-escola").select2(getSelect2Args({
        placeholder: 'Escola',
        data: escolas,
        disabled: false,
        url: '/api/escolas',
        getQuery: function() {
            return {
                cidade_id: $("#busca-cidade").val(),
        }},
    }));

    $("#busca-escola").val($("#busca-escola").attr("value")).trigger("change");
}

function validateVideo(e){
    var form = e.target;
    var valid = true;
    
    var values = [form.autor, form.titulo, form.descricao, form.cidade_id, form.escola_id, form.categoria_id];
  
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

function deleteVideo(e){
    e.stopPropagation();
    e.target.parentElement.submit();
}

function previewVideo(){
    var url = document.getElementById('insert-video-link').value;
    toggleVideoPreview(false);
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

function modalCadastrarEscola(){
    $("#cadastrar-escola form #escola-cidade-id") .val($( "#select-cidade" ).select2('data')[0].id);
    $("#cadastrar-escola form #escola-cidade-nome").val($( "#select-cidade" ).select2('data')[0].text);
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
            initSelectEscolas(response, response[0].id);
            $("#select-escola").addClass("is-valid");
            $("#cadastrar-escola").modal("hide");    
        }
    );

    return false;
}