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
    
    var error = { email: "", senha: "" }
    
    if(!email || !senha){
        if(!email){
            error.email = "Campo obrigatório"
        }

        if(!senha){
            error.senha = "Campo obrigatório"
        }

        return res.render("auth", {error: error});
    }
    
    if(!emailIsValid(email)){
        error.email = "Email inválido";
        return res.render("auth", {error: error});
    }
    
    model.findTCE(email, senha).then(function(tce)
    {                 
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
                    error.senha || error.form                               
                } else {
                    login(res, req, result, nome);
                }           
            });
        } else {
            error.form = "Email e/ou senha inválidos";
            res.render("auth", {error: error}); 
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

function emailIsValid(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

module.exports = auth;