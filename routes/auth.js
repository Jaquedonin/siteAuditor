var express = require('express');
var database = require('../database/database');
var auth = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');
var functions = require('../include/functions');

var token;

auth.use(cors());

process.env.SECRET_KEY = "devesh";


auth.post('/register', function(req, res) {
    var userData = {
        fb_user: req.body["fb-register-user"], 
        email: req.body.email,
        senha: req.body.senha
    };

    functions.connectDB(database.connection).then(function(){
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
        )
    });
});

auth.get('/logout', function(req, res) {
    req.session.token = false;
    req.session.user = false;
    return res.redirect('/');
});

auth.post('/login', function(req, res) {

    var email = req.body.email;
    var senha = req.body.senha;
    
    functions.connectDB(database.connection).then(function(){
        database.connection.query(
            'SELECT * FROM professores WHERE email = ? AND senha = ?', 
            [email, senha], function(err, rows, fields) {
            
            if (err) {
                res.status(400).json({
                    error: 1,
                    data: "Error occured!",
                    err: err
                });
            } else {
                
                if (rows.length > 0) {
                    
                    if (rows[0].senha == senha) 
                    {
                        var professorId = rows[0].id;
                        var payload = JSON.parse(JSON.stringify(rows[0]));
                        var token = jwt.sign(payload, process.env.SECRET_KEY, {
                            expiresIn: 1440
                        });
                        
                        req.session.token = token;
                        req.session.professorId = professorId;
                        
                        req.session.user = {
                            "nome": req.body['fb-name'],
                            "foto": req.body['fb-photo']
                        };

                        res.redirect("/bem-vindo");
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
    })
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