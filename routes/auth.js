var express = require('express');
var auth = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');

var model = require("../models/professores");

auth.use(cors());

process.env.SECRET_KEY = "devesh";

auth.get('/logout', function(req, res) {
    req.session.token = false;
    req.session.user = false;

    return res.redirect('/');
});

auth.post('/login', function(req, res) {
    
    var email = req.body.email;     
    var senha = req.body.senha;          
    model.findTCE(email, senha).then(function(tce)
    {         
        // tce = {email: email, senha: senha, nome: name};          
        if(tce)
        {              
            var email = tce.email;             
            var nome = tce.name;

            model.find(email).then(function(result)
            {                 
                if(!result.length)
                {                     
                    model.insertOne(email, nome).then(function (insert)
                    {
                        result = [{id:insert.insertId}]; 
                        login(res, req, result, nome);
                    });   
                                  
                } else {
                    login(res, req, result, nome);
                }           
            });
        } 
        else{
            res.redirect("/auth"); 
        }             
    }); 
});

function login(res, req, result, nome){
    var payload = JSON.parse(JSON.stringify(result[0]));                 
    req.session.token = jwt.sign(                     
        payload, process.env.SECRET_KEY, { expiresIn: 1440 }
    );                  
    req.session.professorId = result[0].id;                 
    req.session.professorNome = nome;                 
    req.session.user = true;
    req.session.afterLogin = true;
    res.redirect("/dashboard"); 
}

module.exports = auth;