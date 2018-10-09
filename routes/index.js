
var express = require('express');
var router = express.Router();
var database = require('../database/database');
var query = require('../query');
var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./database/data.json', 'utf8'));




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

router.get('/galeria', function(req, res, next) {
    
    var options = { 
        method: 'GET'
       
    };

    request(options, function (error, response, body) {
        
        if (error) throw new Error(error);

        res.render('gallery', response);
        console.log(body);
    });
    
});

router.post('/register', function(req, res, next){

    var userData = 
    {
        fbUser: req.body["fb-register-user"], 
        email: req.body.email,
        senha: req.body.senha
    };

    database.connection.connect(function(err){
        
        if(err) 
        {

            res.status(500).json({
                error: 1,
                data: "Internal Server Error"
            });

        } 

        else 
        {
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

    if(!req.session.token)
    {
        return res.redirect("/auth");
    }

    data.user = true;

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

});

router.get('/auth', function(req, res, next) {
    
    res.render('auth');
});

router.post('/galeria', function(req, res)
{
    var codigo = req.body.cidade;

    //buscar cidade selecionada  e suas estatisticas
    var getGaleriaInfo = function(codigo, index, data) {
        return new Promise(function(resolve, reject) {
            database.connection.query(
                "SELECT group_concat(distinct cidades.nome) as nome, count(distinct escolas.id) as escolas, count(distinct professores_escolas.id) as colaboradores FROM cidades" +
                " LEFT JOIN escolas ON cidade_id = cidades.id" +
                " LEFT JOIN professores_escolas ON escola_id = escolas.id" +
                " WHERE cidades.id = " + codigo
                , function (err, result) { 
                    if(err){
                        reject(err);
                    } else {
                        data = {
                            cidade: result[0].nome,
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
    var getGaleriaVideos = function(codigo, data) {
        return new Promise(function(resolve, reject) {
            database.connection.query(
                "SELECT * FROM videos" +
                " INNER JOIN professores_escolas ON professores_escolas.id = videos.professor_escola_id" +
                " INNER JOIN escolas ON escola_id = escolas.id AND cidade_id = " + codigo     
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
    
    //buscar informacoes e retornar a pagina da galeria como resposta
    getGaleriaInfo(codigo).then(function(data){
        getGaleriaVideos(codigo, data).then(function(data){
            //ao final, envia a view galeria-mapa como resposta
            res.app.render('galeria-mapa', data, function(err, html){
                res.send({html:html});
            });
        });
    });
}); 

module.exports = router;
