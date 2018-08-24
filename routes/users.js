var express = require('express');
var database = require('../database/database');
var users = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');

var token;

users.use(cors());

process.env.SECRET_KEY = "devesh";

users.post('/register', function(req, res) {

    var today = new Date();
    var appData = {
        "error": 1,
        "data": ""
    };

    var userData = {
        nome: req.body.nome, 
        codigo: req.body.codigo
    };

    database.connection.connect(function(err){
        
        if(err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {

            database.connection.query(
                'INSERT INTO cidades SET ?', 
                [userData], 
                function(err, rows, fields) {
                
                    if (!err) {
                        appData.error = 0;
                        appData["data"] = "User registered successfully!";
                        res.status(201).json(appData);
                    } else {
                        appData["data"] = "Error Occured!";
                        res.status(400).json(appData);
                    }

                    database.connection.end();
                }
            );

        }
    });

});

users.post('/login', function(req, res) {

    var appData = {};
    
    var email = req.body.email;
    var password = req.body.password;

    database.connection.connect(function(err, connection) {
        if (err) {
            appData["error"] = 1;
            appData["data"] = "Internal Server Error";
            res.status(500).json(appData);
        } else {
            database.connection.query('SELECT * FROM cidades WHERE nome = ?', [email], function(err, rows, fields) {
                
                if (err) {
                    appData.error = 1;
                    appData["data"] = "Error Occured!";
                    res.status(400).json(appData);
                } else {
                    
                    if (rows.length > 0) {
                        
                        if (rows[0].codigo == password) {
                            console.log(rows, typeof(rows)); 
                            let token = jwt.sign(rows.toJSON(), process.env.SECRET_KEY, {
                                expiresIn: 1440
                            });
                            
                            appData.error = 0;
                            appData["token"] = token;
                            res.status(200).json(appData);
                        } else {
                            appData.error = 1;
                            appData["data"] = "Email and Password does not match";
                            res.status(204).json(appData);    
                        }
                    } else {
                        appData.error = 1;
                        appData["data"] = "Email does not exists!";
                        res.status(204).json(appData);
                    }
                }
                database.connection.end();
            });
        }
    });
});

users.use(function(req, res, next) {
    var token = req.body.token || req.headers['token'];
    var appData = {};
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, function(err) {
            if (err) {
                appData["error"] = 1;
                appData["data"] = "Token is invalid";
                res.status(500).json(appData);
            } else {
                next();
            }
        });
    } else {
        appData["error"] = 1;
        appData["data"] = "Please send a token";
        res.status(403).json(appData);
    }
});

users.get('/getUsers', function(req, res) {

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

module.exports = users;