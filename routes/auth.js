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
    var request = require('request');
    request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://obras4d.tce.pb.gov.br:33307/api/auth/signin",
        "body": JSON.stringify({
              emailOrCpf : email,
              password : senha
    })
    }, (error, response, body) => 
    {
        if(error) 
        {
            console.log("Não Encontrou no banco do tce");
            return res.redirect('/');
        }
        //console.dir(body);
        console.log("Encontrou no banco do tce");
        model.find({where: {email: req.body.email}}).then(function(result)
        {
            
            if(!result.length)
            {
                model.insertOne(req).then(function (result) {
                    console.log("Deu certo a inserçao");
                    console.log(result);
                    return res.redirect('/auth'); 
                });
            }

            if(result[0].senha != req.body.senha)
            {
                return res.redirect('/');
                // res.status(204).json({
                //     error: 1,
                //     data: 'Email e senha incorretos'
                // });
            }
        
            var payload = JSON.parse(JSON.stringify(result[0]));  
            req.session.token = jwt.sign(
                payload, process.env.SECRET_KEY, { expiresIn: 1440 }
            );
            req.session.professorId = result[0].id;
            req.session.user = true;

            return res.redirect("/bem-vindo");
    
        });       
    });
});

var requesting = function(email,senha){
    var request = require('request');
    request.post({
        "headers": { "content-type": "application/json" },
        "url": "http://obras4d.tce.pb.gov.br:33307/api/auth/signin",
        "body": JSON.stringify({
              emailOrCpf : email,
              password : senha
    })
    }, (error, response, body) => {
        if(error) {
            return false;
        }
        //console.dir(body);
        return true;

        
    });
}

module.exports = auth;