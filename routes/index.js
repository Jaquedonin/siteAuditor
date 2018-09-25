var express = require('express');
var router = express.Router();

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./database/data.json', 'utf8'));

/* GET home page. */
router.get('/', function(req, res, next) {
    
    data.user = req.session.user;
    res.render('index', data);
});

router.get('/bem-vindo', function(req, res, next) {
    
    if(!req.session.user){
        data.user = false;
        return res.redirect("/auth");
    } 
    
    data.user = req.session.user
    res.render('bem-vindo', data);
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
                'INSERT INTO usuarios SET ?', 
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
    
    if(!req.session.user){
        data.user = false;
        return res.redirect("/auth");
    } else {
        data.user = req.session.user;
    }
    
    res.render('dashboard', data);
});

router.get('/auth', function(req, res, next) {
    res.render('auth');
});

router.post('/galeria', function(req, res){
    
    codigo.cidade = req.body.cidade;
    
    res.status(200).json({
        error: 0,
        data: "User registered successfully!" 
    });
}); 

module.exports = router;
