
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
    
    if(!req.session.user){
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

    var userData = {
        fbUser: req.body["fb-register-user"], 
        email: req.body.email,
        senha: req.body.senha
    };

    database.connection.connect(function(err){
        
        if(err) {

            res.status(500).json({
                error: 1,
                data: "Internal Server Error"
            });

        } else {
            database.connection.query(
                'INSERT INTO professores SET ?', 
                [userData], 
                function(err, rows, fields) {
                
                    if (err) {
                        res.status(400).json({
                            error: 1,
                            data: "Error Occured!"
                        });
                    } else {             
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

    /*console.log("dashboard", req.session);
    if(!req.session.token)
    {
        return res.redirect("/auth");

    } else {
        data.user = req.session.user;
    }

    res.render('dashboard', data);

    data.user = true;
    database.connection.query(query.findAllVideos(req.session.professorId), function (err, result) {
        if(!err){
            console.log(result)
            data.videos = result;
            console.log(result)
            database.connection.query(query.findAll('cidades'), function (err, result) {
                if(!err){

                    data.cidades = result;
                    console.log(result)
                    res.render('dashboard', data);
                }
            });  
        }else{
            console.log(err);
        }
    }); 
    */
    if(!req.session.token){
        return res.redirect("/auth");
    }

    data.user = true;
    console.log("testes")
    database.connection.query(query.findAllVideos(req.session.professorId), function (err, result) {
        if(!err){
            console.log(result)
            data.videos = result;
            console.log(result)
            database.connection.query(query.findAll('cidades'), function (err, result) {
                if(!err){

                    data.cidades = result;
                    console.log(result)
                    res.render('dashboard', data);
                }
            });  
        }else{
            console.log(err);
        }
    });
     
});

router.get('/auth', function(req, res, next) {
    res.render('auth');
});

router.post('/galeria', function(req, res){
    
    var codigo = req.body.cidade;
    var cidades = JSON.parse(fs.readFileSync('public/javascripts/cidades.json', 'utf8'));

    res.status(200).json({
        error: 0,
        data: cidades[codigo]
    });
}); 

module.exports = router;
