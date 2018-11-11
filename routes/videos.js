var express = require('express');
var router = express.Router();
var model = require("../models/videos");

//inserir video
router.post('/videos', function(req, res, next) {

    model.insertOne(req).then(function(result){
        req.session.insert = {
            status: result ? 200 : 400,
            msg: result ? "Vídeo inserido com sucesso!" : "Erro"
        }
        return res.redirect('/dashboard');
    });
    
});

//excluir videos
router.post('/delete/videos', function(req, res, next) {
    
    model.deleteOne(req.body.id).then(function(result){
        req.session.delete = {
            status: result ? 200 : 400,
            msg: result ? "Vídeo excluído com sucesso!" : "Erro"
        }
        return res.redirect('/dashboard');
    });

});

module.exports = router;
