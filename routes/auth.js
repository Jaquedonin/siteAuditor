var express = require('express');
var auth = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');

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

    model.find({where: {email: req.body.email}}).then(function(result){

        if(!result)
            res.status(204).json({
                error: 1,
                data: 'Email não existe!'
            });

        if(result[0].senha != req.body.senha)
            res.status(204).json({
                error: 1,
                data: 'Email e senha incorretos'
            });

        var payload = JSON.parse(JSON.stringify(result[0]));
            
        req.session.token = jwt.sign(
            payload, process.env.SECRET_KEY, { expiresIn: 1440 }
        );
        req.session.professorId = result[0].id;
        req.session.user = true;

        res.redirect("/bem-vindo");
    });

});

module.exports = auth;