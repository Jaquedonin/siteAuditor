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
        email: req.body.email,
        senha: req.body.senha
    };

    database.pool.getConnection(function(err, connection) {
        var query = 'INSERT INTO professores SET ?';
        connection.query(query, [userData], function(err, rows, fields) {
            connection.release();
        }).on('error', function(err) {
            console.log(err);
        }); 
    });
    
    return res.redirect("/auth");
});

auth.get('/logout', function(req, res) {
    req.session.token = false;
    req.session.user = false;

    return res.redirect('/');
});

auth.post('/login', function(req, res) {

    var email = req.body.email;
    var senha = req.body.senha;
    
    database.pool.getConnection(function(err, connection) {

        var query = 'SELECT * FROM professores WHERE email = ? AND senha = ?';
            
        connection.query(query, [email, senha], function(err, rows, fields) {
            
            connection.release();
            
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

module.exports = auth;