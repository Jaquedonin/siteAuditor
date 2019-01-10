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

    $("#select-cidade").select2(getSelect2Args({
        placeholder: 'Cidade',
        url: '/api/cidades'
    }));

    $("#select-cidade").on("change", function(e){

        $("#select-escola").val("").trigger("change");
       
        if(!e.target.value){
            $("#select-escola").attr({'disabled': true }).trigger('change.select2');
        } else {
            getEscolas();
            $("#select-escola").attr({'disabled': false}).trigger('change.select2');
        }

    });

    //campo e cadastro de escola
    $("#cadastrar-escola form").on("submit", function(e){ return cadastrarEscola(e); })
    $("#cadastrar-escola").on("hidden.bs.modal", function(){
        $("#cadastrar-escola form").trigger("reset");
    });
    
    $("#select-escola").select2(getSelect2Args({
        placeholder: 'Escola',
        disabled: true,
        url: '/api/escolas',
        getQuery: function(){ 
            return {
                cidade: $("#select-cidade").val(),
                insert_escola: true
            }
        },
    }));

    $("#select-escola").on("change", function(e){
        if(e.target.value == "nova-escola"){
            modalCadastrarEscola();
        }
    });

    //filtros da listagem de videos do professor
    $("#busca-cidade").select2(getSelect2Args({
        placeholder: 'Digite a cidade',
        url: '/api/cidades',
    }));
    
    $("#busca-escola").select2(getSelect2Args({
        placeholder: 'Escola',
        disabled: false,
        url: '/api/escolas',
        getQuery: function() { return {
            cidade: $("#busca-cidade").val(),
        }},
    }));

});

function validateVideo(e){
    var form = e.target;
    var valid = true;
    
    var values = [form.autor, form.titulo, form.descricao, form.cidade_id, form.escola_id, form.categoria_id];
    console.log(values);    
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

function getEscolas(){

    var getQuery = function(){ 
        return {
            cidade: $("#select-cidade").val(),
            insert_escola: true
        }
    }; 

    post('/api/escolas', getQuery(),
        function(response){
            response.unshift({id:"", text:""})
            
            $("#select-escola").select2(getSelect2Args({
                getQuery: getQuery,
                placeholder: 'Escola',
                url: '/api/escolas',
                data: response,
                disabled: false
            }));
        }
    );
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
            getEscolas();
            $("#select-escola").val(response.id).trigger("change");
            $("#select-escola").addClass("is-valid");
            
            $("#cadastrar-escola").modal("hide");
        }
    );

    return false;
}