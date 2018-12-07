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

var getVideo = function (id){
    return new Promise(function(resolve, reject){
        
        //busca video
        model.findById(id).then(function(results){   
            if(!results)
                reject(false);

            var video = results[0];
            resolve(video);
        })
    })
}

//exibir video e incrementar visualizacao
router.get('/video/:id', function(req, res) {
    getVideo(req.params.id).then(function(video){
        model.incrementViews(video.id).then(function(){
            res.app.render('video', {video: video}, function(err, html){
                if(err)
                console.log(err);
            
                res.send({html:html, museu: !(!req.session.museu)});
            });
        });   
    })
});

//exibir video em aba externa no museu
router.get('/video-museu/:id', function(req, res){

    getVideo(req.params.id).then(function(video){
        model.incrementViews(video.id).then(function(){
            res.app.render('video-museu', {video: video}, function(err, html){
                
                if(err)
                console.log(err);
            
                res.send({html:html});
            });
        });   
    })

});

//exibir video no dashboard
router.get('/video-dashboard/:id', function(req, res){

    getVideo(req.params.id).then(function(video){
        res.app.render('video', {video: video}, function(err, html){
        
            if(err)
                console.log(err);
            
            res.send({html:html});

        })
    })

});

module.exports = router;
