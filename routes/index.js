var express = require('express');
var router = express.Router();
var database = require('../database/database');
var query = require('../query');
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./database/data.json', 'utf8'));
var functions = require('../include/functions');
var https = require('https');

/* GET home page. */
router.get('/', function(req, res, next) {
    
    data.user = req.session.user;
    res.render('index', data);
   
});

router.get('/bem-vindo', function(req, res, next) {
    
    if(!req.session.user)
    {
        //data.user = false;
        data.professores = false;
        return res.redirect("/auth");
    } 
    
    data.user = req.session.user
    res.render('bem-vindo', data);
});

router.get('/galeria/:cidade/:escola/:categoria?', function(req, res, next) {

    var getCidade = function (data){
        return new Promise(function(resolve, reject) {
            database.connection.query(
                "SELECT * FROM cidades WHERE codigo = " + data.cidade.codigo
                , function (err, result) { 
                    if(err){
                        reject(err);
                    } else {
                        data.cidade.nome = result.length > 0 ? result[0].cidade : "";
                        resolve(data);
                    }
                }
            )
        });
    }

    var getCategorias = function (data, categoria){
        return new Promise(function(resolve, reject) {
            database.connection.query(
                "SELECT id, descricao, CASE WHEN descricao LIKE '"+data.categoria.descricao+"' THEN 1 ELSE 0 END as selected FROM categorias", function (err, result) { 
                    if(err){
                        reject(err);
                    } else {
                        data.categorias = result
                        resolve(data);
                    }
                }
            )
        });
    }

    var getEscola = function (data){
        return new Promise(function(resolve, reject) {
            database.connection.query(
                "SELECT * FROM escolas WHERE id = " + data.escola.id
                , function (err, result) { 
                    if(err){
                        reject(err);
                    } else {
                        data.escola.nome = result.length > 0 ? result[0].nome : ""
                        resolve(data);
                    }
                }
            )
        });
    }

    //buscar videos da cidade selecionada
    var getGaleriaVideos = function(data) {
        
        var query = "SELECT videos.*, escolas.nome as escola FROM videos" +
        " INNER JOIN cidades ON cidades.codigo = " + data.cidade.codigo +
        " INNER JOIN escolas ON videos.escola_id = escolas.id AND escolas.cidade_id = " + data.cidade.codigo;

        if(data.escola.id){
            query += " AND escolas.id = " + data.escola.id;
        }

        if(data.categoria.descricao){
            query += " INNER JOIN categorias ON categorias.id = videos.categoria_id AND categorias.descricao LIKE '" + data.categoria.descricao + "'"; 
        } else {
            query += " LEFT JOIN categorias ON categorias.id = videos.categoria_id";
            // query += " ORDER BY videos.views"
        }
        
        return new Promise(function(resolve, reject) {
            database.connection.query(query, function (err, result) { 
                    if(err){
                        reject(err);
                    } else {
                        if(result.length > 0){
                            data.escola.nome = data.escola.id ? result[0].escola : "";
                            data.categoria.videos = result;
                        }
                        resolve(data);
                    }
                }
            )
        });
    }

    var data = {
        cidade: {
            codigo: req.params.cidade
        },
        escola: {
            id: req.params.escola == "todas" ? false : req.params.escola
        },
        categoria: {
            destaque: !req.params.categoria || req.params.categoria == "destaques",
            descricao: req.params.categoria == "destaques" ? false : req.params.categoria
        }
    }
    
    functions.connectDB(database.connection).then(function(){
        getGaleriaVideos(data).then(function(data){
            getCidade(data).then(function(data){
                getCategorias(data).then(function(data){
                    getEscola(data).then(function(data){
                        res.render('galeria', data);
                    })
                })
            })
        })
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
    functions.connectDB(database.connection).then(function(){       
        database.connection.query(
            "SELECT codigo as 'value', nome as 'label' FROM cidades WHERE nome LIKE '%"+ req.body.term + "%'", 
            function (err, result) {
                res.json(!err ? result : false);
        });
    });
});

router.post('/api/escolas', function(req, res, next){
    functions.connectDB(database.connection).then(function(){

        var query =  "SELECT escolas.id as 'value', escolas.nome as 'label' FROM escolas" +
        " WHERE escolas.nome LIKE '%"+ req.body.term + "%'"

        if(req.body.cidade){
            query += " AND escolas.cidade_id = " + req.body.cidade
        }

        database.connection.query(query, function (err, result) {  
                res.json(!err ? result : false);
        });
    });
});

router.post('/register', function(req, res, next){

    var userData = 
    {
        fbUser: req.body["fb-register-user"], 
        email: req.body.email,
        senha: req.body.senha
    };

    functions.connectDB(database.connection).then(function(){    
        if(err) 
        {

            res.status(500).json({
                error: 1,
                data: "Internal Server Error"
            });

        } else {
            database.connection.query(
                'INSERT INTO professores SET ?', 
                [userData], 
                function(err, rows, fields) 
                {
                
                    if (err) 
                    {
                        res.status(400).json({
                            error: 1,
                            data: "Error Occured!"
                        });
                    } 

                    else 
                    {             
                        res.status(201).json({
                            error: 0,
                            data: "User registered successfully!" 
                        });
                    }
                
                    database.connection.end();
                }
            );
        }
    });
});

router.get('/dashboard', function(req, res, next) {

    if(!req.session.token){
        return res.redirect("/auth");
    }

    data.user = true;

    if(req.session.delete){
        console.log(req.session.delete.status, req.session.delete.msg);
        req.session.delete = false;
    }

    if(req.session.insert){
        console.log(req.session.insert.status, req.session.insert.msg);
        req.session.insert = false;
    }

    functions.connectDB(database.connection).then(function(){
        database.connection.query(query.findAllVideos(req.session.professorId), function (err, result) 
        {
            if(!err)
            {

                data.videos = result;
                database.connection.query(query.findAll('cidades'), function (err, result) {
                    
                    if(!err)
                    {
                        data.cidades = result;
                        res.render('dashboard', data);
                    }
                }); 
            }

            else
            {
                console.log(err);
            }
        });

        database.connection.query(query.findAll('categorias'), function (err, result) 
        {
            if(!err)
            {
                data.categorias = result;
            }

            else
            {
                console.log(err);
            }
        });
    });
});

router.get('/auth', function(req, res, next) {
    res.render('auth');
});

router.get('/video/:id', function(req, res) {
    
    var getVideo = function (id){
        return new Promise(function(resolve, reject){
            database.connection.query("SELECT * FROM videos WHERE id = " + id, function(err, result){
                if(err){
                    reject(err);
                } else {
                    resolve(result ? result[0] : false)
                }
            });
        });
    }

    functions.connectDB(database.connection).then(function(){
        getVideo(req.params.id).then(function(data){
            res.app.render('video', {video: data}, function(err, html){
                res.send({html:html});
            });
            
        });
    });
        
});

router.post('/galeria', function(req, res)
{
    var codigo = req.body.cidade;

    //buscar cidade selecionada  e suas estatisticas
    var getCidadeInfo = function(codigo, index, data) {
        return new Promise(function(resolve, reject) {
            database.connection.query(
                "SELECT group_concat(distinct cidades.nome) as nome, count(distinct escolas.id) as escolas, count(distinct videos.professor_id) as colaboradores FROM cidades" +
                " LEFT JOIN escolas ON escolas.cidade_id = cidades.codigo" +
                " LEFT JOIN videos ON videos.cidade_id = cidades.codigo" +
                " WHERE cidades.codigo = " + codigo
                , function (err, result) { 
                    if(err){
                        reject(err);
                    } else {
                        data = {
                            cidade: {
                                codigo: codigo,
                                nome: result[0].nome,
                            },
                            colaboradores: result[0].colaboradores,
                            escolas: result[0].escolas
                        }
                        resolve(data);
                    }
                }
            )
        });
    }
    
    //buscar videos da cidade selecionada
    var getCidadeVideos = function(codigo, data) {
        return new Promise(function(resolve, reject) {
            database.connection.query(
                "SELECT videos.* FROM videos" +
                " INNER JOIN escolas ON escola_id = escolas.id AND escolas.cidade_id = " + codigo     
                , function (err, result) { 
                    if(err){
                        reject(err);
                    } else {
                        data.videos = result;
                        resolve(data);
                    }
                }
            )
        });
    }
    
    functions.connectDB(database.connection).then(function(){
        //buscar informacoes e retornar a pagina da galeria como resposta
        getCidadeInfo(codigo).then(function(data){
            getCidadeVideos(codigo, data).then(function(data){
                data.user = req.session.user
                //ao final, envia a view galeria-mapa como resposta
                res.app.render('galeria-mapa', data, function(err, html){
                    res.send({html:html});
                });
            });
        });
    })

}); 

module.exports = router;
