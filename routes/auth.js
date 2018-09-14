var express = require('express');
var database = require('../database/database');
var auth = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');

var token;

auth.use(cors());

process.env.SECRET_KEY = "devesh";

auth.post('/register', function(req, res) {
    var userData = {
        fb_user: req.body["fb-register-user"], 
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

auth.post('/login', function(req, res) {

    var fbUser = req.body['fb-login-user'];
    var email = req.body.email;
    var senha = req.body.senha;
   
    database.connection.query(
        
        'SELECT * FROM usuarios WHERE email = ? AND fb_user = ?', 
        [email, fbUser], function(err, rows, fields) {
        
        if (err) {
            res.status(400).json({
                error: 1,
                data: "Error occured!"
            });
        } else {
            
            if (rows.length > 0) {
                
                if (rows[0].senha == senha) {

                    var payload = JSON.parse(JSON.stringify(rows[0]));
                    
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    });
                    
                    req.session.token = token;
                    req.session.professorId = rows[0].id;
                    return res.redirect('/dashboard');

                } else {
                    res.status(204).json({
                        error: 1,
                        data: 'Email and Password does not match'
                    });
                }

            } else {;
                res.status(204).json({
                    error: 1,
                    data: 'Email does not exists!'
                });
            }
        }
    });
});

auth.get('/getUsers', function(req, res) {

    var appData = {};

    database.connection.getConnection(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            connection.query('SELECT * FROM cidades', function(err, rows, fields) {
                if (!err) {
                    appData["error"] = 0;
                    appData["data"] = rows;
                    res.status(200).json(appData);
                } else {
                    appData["data"] = "No data found";
                    res.status(204).json(appData);
                }
            });
            connection.release();
        }
    });
});

module.exports = auth;