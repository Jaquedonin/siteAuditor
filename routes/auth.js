var express = require('express');
var auth = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');
var requisicao = require("../query/POST");
var model = require("../models/professores");


auth.use(cors());

process.env.SECRET_KEY = "devesh";

auth.post('/register', function(req, res) {
    
    model.insertOne(req).then(function (result) {
        // if(!result)   
        return res.redirect("/auth");
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
    model.findTCE(email, senha).then(function(tce)
    {         console.log(tce);
        // tce = {email: email, senha: senha, nome: name};          
        if(tce )
        {              
            var email = tce.email;             
            var nome = tce.name;
            console.log(email);
            console.log(nome); 

            model.find(email).then(function(result)
            {                 
                // result = {id: 1, nome: "Maria"} || false                  
                    if(!result)
                    {                     
                        var result = model.insertOne(email, nome).then(function (insert)
                        {
                            console.log("Insert ",insert);
                            return [{id:insert.insertId}]; 
                        });                 
                    }
                console.log("result ",result);                  
                var payload = JSON.parse(JSON.stringify(result[0]));                 
                req.session.token = jwt.sign(                     
                payload, process.env.SECRET_KEY, { expiresIn: 1440 });                  
                req.session.professorId = result[0].id;                 
                req.session.professorNome = nome;                 
                req.session.user = true;                 
                res.redirect("/bem-vindo");             
            });

        } 
        else{
            res.redirect("/auth"); 
        }                 
            
    }); 
    
});


module.exports = auth;