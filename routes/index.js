var express = require('express');
var router = express.Router();
var https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {user: req.session.user});
});

router.get('/bem-vindo', function(req, res, next) {
    
    if(!req.session.user){
        return res.redirect("/auth");
    } 
    
    res.render('bem-vindo', {user: req.session.user});
});

router.post('/register', function(req, res, next){

    var professores = require("../models/professores");

    professores(req).then(function (result) {
        if (!result) res.status(400).json({ error: 1, data: "Error Occured!"});
        
        res.status(201).json({ error: 0, data: "User registered successfully!"});
    });
 
});

router.get('/video', function(req,res){
    res.render('aba-visualizar-video');
})

router.all('/galeria/:cidade/:escola?', function(req, res, next) {

    var setCidade = function (data){
        return new Promise(function(resolve, reject){
            var cidades = require("../models/cidades");
            cidades.findOne(data.cidade.codigo).then(function(result){
                data.cidade.nome = result.length > 0 ? result[0].nome : "";
                resolve(true);
            })
        });
    }

    var setEscola = function (data){
        return new Promise(function(resolve, reject){
            var escolas = require("../models/escolas");
            escolas.findOne(data.escola.id).then(function(result){
                data.escola.nome = result.length > 0 ? result[0].nome : "";
                resolve(true);
            })
        });
    }

    var setCategorias = function (data){
        return new Promise(function(resolve, reject){
            var categorias = require("../models/categorias");
            categorias.find().then(function(result){
                data.categorias = data.categorias.concat(result); 
                resolve(true);
            })
        });
    }

    var setVideos = function(data){
        return new Promise(function(resolve, reject){
            var params = {
                cidade: data.cidade.codigo,
                escola: data.escola.id,
                busca: data.busca
            };
            
            var videos = require("../models/videos");
            videos.findByCategoria(data.categorias, params).then(function(result){
                data.videos = result; 
                resolve(true);
            })
        });
    }

    var data = {
        busca: req.body.termo,
        cidade: { codigo: req.params.cidade },
        escola: { id: req.params.escola == "todas" ? false : req.params.escola },
        user: !(!req.session.token),
        categorias: [
            { id: 0, descricao: "destaques" }
        ]
    }

    setCidade(data)
        .then(function(){ return setEscola(data); })
        .then(function(){ return setCategorias(data); })
        .then(function(){ return setVideos(data); })
        .then(function(){ res.render('galeria', data) })
        .catch(function(err) { 
            console.log(err);
            res.redirect("/");
        });
        
});

router.post('/api/fb', function(req, res, next){

    var id = req.body.id;
    var fields = req.body.fields;
    var accessToken = "460691281030259|NI2_FSbKRZCLjcV9NhQI8UuNmIQ";

    https.get('https://graph.facebook.com/v3.0/'+id+'?fields=' + fields + '&access_token=' + accessToken , function(resp) {
    
        var data = '';
        
        resp.on('data', function(chunk) {
            data += chunk;
        }).on('end', function() {
            res.json(JSON.parse(data));
        });

    });
});

router.post('/api/cidades', function(req, res, next){
    
    var cidades = require("../models/cidades");
    var params = {
        cols: "codigo as 'value', nome as 'label'",
        where: {
            term: req.body.term
        }
    };

    cidades.find(params)
        .then(function(result){
            if (!result) 
                res.json(false); 
            
            res.json(result);
        });
});

router.post('/api/escolas', function(req, res, next){

    var escolas = require("../models/escolas");
    var params = {
        cols: "id as 'value', nome as 'label'",
        where: {
            term: req.body.term,
            cidade: req.body.cidade
        }
    }

    escolas.find(params)
        .then(function(result){
            if (!result) 
            res.json(false); 
        
            res.json(result);
        });
});

router.get('/dashboard', function(req, res, next) {

    if(!req.session.token){
        return res.redirect("/auth");
    }

    var data = {user: true};

    if(req.session.delete){
        console.log(req.session.delete.status, req.session.delete.msg);
        req.session.delete = false;
    }

    if(req.session.insert){
        console.log(req.session.insert.status, req.session.insert.msg);
        req.session.insert = false;
    }

    var setVideos = new Promise(function(resolve, reject){
        var videos = require("../models/videos");
        videos.findByProfessor(req.session.professorId)
            .then(function(result){
                data.videos = result;
                resolve(true);
            });
    });
    
    var setCategorias = new Promise(function(resolve, reject){
        var categorias = require("../models/categorias");
        categorias.find().then(function(result){
            data.categorias = result;
            resolve(true);
        });
    });
    
    setVideos
        .then(function(){ return setCategorias; })
        .then(function(){ res.render('dashboard', data); })
        .catch(function(err) { 
            console.log(err);
            res.redirect("/");
        });
});

router.get('/auth', function(req, res, next) {
    res.render('auth');
});

router.post('/galeria', function(req, res){
    
    var setEstatisticas = new Promise(function(resolve, reject){
        var cidades = require("../models/cidades");
        cidades.getEstatisticas(req.body.cidade).then(function(result){
            data = result;
            resolve(true);
        });
    });
    
    var setVideos = new Promise(function(resolve, reject){
        var videos = require("../models/videos");
        videos.findByCidade(req.body.cidade).then(function(result){
            data.videos = result;
            resolve(true);
        });
    });
    
    var data = {};
    //buscar cidade e suas estatisticas
    setEstatisticas.then(function(){ 
        //buscar videos
        setVideos.then(function(){    
            //ao final, envia a view galeria-mapa como resposta
            res.app.render('galeria-mapa', data, function(err, html){
                res.send({ html:html });
            });  
        })
    }).catch(function(err) { 
        console.log(err);
        res.redirect("/");
    });
}); 

module.exports = router;
