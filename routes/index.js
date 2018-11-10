var express = require('express');
var router = express.Router();
var database = require('../database/database');
var query = require('../query');
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./database/data.json', 'utf8'));
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

router.all('/galeria/:cidade/:escola?', function(req, res, next) {

    var getCidade = function (data){
        return new Promise(function(resolve, reject) {
            database.pool.getConnection(function(err, connection) {
                if (err) reject(err);
              
                var query = "SELECT * FROM cidades WHERE codigo = " + data.cidade.codigo;
                    
                connection.query(query, function (err, result) {
                    connection.release();
                
                    if (err) reject(err); 
                    
                        data.cidade.nome = result.length > 0 ? result[0].nome : "";
                        resolve(data);
                    
                })
        });
        });
    }

    var getCategorias = function (data){
        return new Promise(function(resolve, reject) {
            database.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                
                var query = "SELECT id, descricao FROM categorias";  
                connection.query(query, function (err, result) {
                    connection.release();
                
                    if (err) reject(err); 
                    
                    data.categorias = result;
                    data.categorias.unshift({id: 0, descricao: "destaques"});

                        resolve(data);
                    
                });  
            });
        });
    }

    var getEscola = function (data){
        return new Promise(function(resolve, reject) {
            
            database.pool.getConnection(function(err, connection) {
                if (err) reject(err);
                
                var query = "SELECT * FROM escolas WHERE id = " + data.escola.id;
                  
                connection.query(query, function (err, result) {
                    connection.release();
                
                    if (err) reject(err); 
                    
                    data.escola.nome = result.length > 0 ? result[0].nome : "";
                        resolve(data);
                    
                });  
            });
                        
        });
    }

    //buscar videos da cidade selecionada
    var getCategoriasVideos = function(data) {
        
        return new Promise(function(resolve, reject) {
            var queries = [];
            
            data.categorias.forEach(function(categoria){
        var query = "SELECT videos.*, escolas.nome as escola FROM videos" +
        " INNER JOIN cidades ON cidades.codigo = " + data.cidade.codigo +
        " INNER JOIN escolas ON videos.escola_id = escolas.id AND escolas.cidade_id = " + data.cidade.codigo;

                if(data.escola.id) 
            query += " AND escolas.id = " + data.escola.id;

                if(categoria.id > 0)
                    query += " INNER JOIN categorias ON categorias.id = videos.categoria_id AND categorias.id = " + categoria.id; 
        
                if(data.busca)
            query += " WHERE videos.titulo LIKE '%" + data.busca + "%' OR videos.descricao LIKE '%" + data.busca + "%'";
        
        query += " ORDER BY videos.views DESC";
        
                queries.push(query);
            });
                    
            var multipleQueries = queries.join(";");

            database.pool.getConnection(function(err, connection) {
                connection.query(multipleQueries, function (err, results) {
                    connection.release();
                    
                    if (err) return err; 

                    data.videos = results;
                    resolve(data);
                    
                }).on('error', function(err) {
                    reject(err);
                }); 
            });
        });
    }

    var data = {
        busca: req.body.termo,
        cidade: { codigo: req.params.cidade },
        escola: { id: req.params.escola == "todas" ? false : req.params.escola },
        user: !(!req.session.token)
    }

    getCategoriasVideos(data)
        .then(function(data){ 
            console.log(data);
            res.render('galeria', data) 
        })
        .then(getCidade(data))
        .then(getEscola(data))
        .then(getCategorias(data))    
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
    database.pool.getConnection(function(err, connection) {
        if (err) reject(err);
      
        var query = "SELECT codigo as 'value', nome as 'label' FROM cidades WHERE nome LIKE '%"+ req.body.term + "%'"; 
            
        connection.query(query, function (err, result) {
            connection.release();
        
            if (err) res.json(false); 
            
            res.json(result);
        })
    });
});

router.post('/api/escolas', function(req, res, next){
    database.pool.getConnection(function(err, connection) {

        var query =  "SELECT escolas.id as 'value', escolas.nome as 'label' FROM escolas" +
        " WHERE escolas.nome LIKE '%"+ req.body.term + "%'"

        if(req.body.cidade){
            query += " AND escolas.cidade_id = " + req.body.cidade
        }

        connection.query(query, function (err, result) {
            connection.release();
        
            if (err) res.json(false); 
            
            res.json(result);
        })
    });
});

router.post('/register', function(req, res, next){

    var userData = { 
        email: req.body.email,
        senha: req.body.senha
    };

    database.pool.getConnection(function(err, connection) {

        var query = 'INSERT INTO professores SET ?';

        connection.query(query, [userData], function (err, result) {
            connection.release();
                
            if (err) res.status(400).json({ error: 1, data: "Error Occured!"});

            res.status(201).json({ error: 0, data: "User registered successfully!"});
        });
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

    database.pool.getConnection(function(err, connection) {

        var queryVideos = query.findAllVideos(req.session.professorId);
        var queryCidades = query.findAll('cidades');
        var queryCategorias = query.findAll('categorias');

        connection.query(queryVideos, function (err, result) {
            if (err) res.redirect('/') 

            data.videos = result;
            
            connection.query(queryCidades, function (err, result) {
                if (err) res.redirect('/') 

                data.cidades = result;

                connection.query(queryCategorias, function (err, result){
                    connection.release();

                    if (err) res.redirect('/') 

                    data.categorias = result;
                    res.render('dashboard', data);
                });
            }); 
        });
    });
});

router.get('/auth', function(req, res, next) {
    res.render('auth');
});

router.get('/video/:id', function(req, res) {
    
    var getVideo = function (id){
        var queryVideo = "SELECT * FROM videos WHERE id = " + id;
        return new Promise(function(resolve, reject){   
            database.pool.getConnection(function(err, connection) {
                connection.query(queryVideo, function(err, result){
                    connection.release();
                    
                    if(err) reject(false);
                    
                    resolve(result)
                });
            });
        })
    }

    var incrementViews = function(data){
        var queryIncrement = query.updateOne("videos", data[0].id, "views = views + 1");
        return new Promise(function(resolve, reject){       
            database.pool.getConnection(function(err, connection) {
                connection.query(queryIncrement, function (err, result) {
                    connection.release();

                    if(err) reject(err);
                    
                    resolve(data);
                });
            })

        });
    } 

    getVideo(req.params.id).then(function(data){
        incrementViews(data).then(function(data){
            res.app.render('video', {video: data[0]}, function(err, html){
                res.send({html:html});
            });
        });
    });
        
});

router.post('/galeria', function(req, res){
    var codigo = req.body.cidade;

    //buscar cidade selecionada  e suas estatisticas
    var getCidadeInfo = function(codigo, index, data) {
        return new Promise(function(resolve, reject){       
            database.pool.getConnection(function(err, connection) {
                
                var query = "SELECT group_concat(distinct cidades.nome) as nome, count(distinct escolas.id) as escolas, count(distinct videos.professor_id) as colaboradores FROM cidades" +
                " LEFT JOIN escolas ON escolas.cidade_id = cidades.codigo" +
                " LEFT JOIN videos ON videos.cidade_id = cidades.codigo" +
                " WHERE cidades.codigo = " + codigo;
               
                
                connection.query(query, function (err, result) { 
                    
                    connection.release();

                    if(err) reject(err);
                    
                    data = {
                        cidade: {
                            codigo: codigo,
                            nome: result[0].nome,
                        },
                        colaboradores: result[0].colaboradores,
                        escolas: result[0].escolas
                    }

                    resolve(data);
                })
            })
        })
    }
    
    //buscar videos da cidade selecionada
    var getCidadeVideos = function(codigo, data) {
        return new Promise(function(resolve, reject){       
            database.pool.getConnection(function(err, connection) {
                
                var query = "SELECT videos.* FROM videos" +
                " INNER JOIN escolas ON escola_id = escolas.id AND escolas.cidade_id = " + codigo +     
                " ORDER BY videos.views DESC";
                
                connection.query(query, function (err, result) { 
                    if(err)  reject(err);
                    
                    data.videos = result;
                    resolve(data);
                })
            });
        });
    }
    
    
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

}); 

module.exports = router;
