
var express = require('express');
var router = express.Router();
var database = require('../database/database');
var query = require('../query');

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./database/data.json', 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', data);
});

router.get('/bem-vindo', function(req, res, next) {
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
    if(!req.session.token){
        return res.redirect("/auth");
    }

    data.user = true;

    database.connection.query(query.findAll("professores_escolas", req.session.professorId), function (err, result) {
        if(!err){
            data.videos = result;
            res.render('dashboard', data);
        }
    });  
    
});

router.get('/auth', function(req, res, next) {
    res.render('auth');
});

module.exports = router;
