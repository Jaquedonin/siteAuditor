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

//exibir video

router.get('/video/:id', function(req, res) {
    var getVideo = function (id){
        return new Promise(function(resolve, reject){
            var videos = require("../models/videos");
           
            //busca video
            videos.findById(id).then(function(results){   
                if(!results)
                    reject(false);

                var video = results[0];
                
                // adiciona visualização
                return videos.incrementViews(video.id).then(function(){
                    //retorna video
                    resolve(video);
                });   
            })
        })
    }   

    getVideo(req.params.id).then(function(video){
        console.log(video);
        res.app.render('video', {video: video}, function(err, html){
            console.log(err);
            res.send({html:html});
        });
    })
});

router.get('/video-aba/:id', function(req, res) {
    var getVideo = function (id){
        return new Promise(function(resolve, reject){
            var videos = require("../models/videos");
           
            //busca video
            videos.findById(id).then(function(results){   
                if(!results)
                    reject(false);

                var video = results[0];
                resolve(video);   
            })
        })
    }   

    getVideo(req.params.id).then(function(video){
        console.log(video);
        res.app.render('video-aba', {video: video}, function(err, html){
            console.log(err);
            res.send({html:html});
        });
    })
});

router.get('/video-dashboard/:id', function(req, res) {
    var getVideo = function (id){
        return new Promise(function(resolve, reject){
            var videos = require("../models/videos");
           
            //busca video
            videos.findById(id).then(function(results){   
                if(!results)
                    reject(false);

                var video = results[0];
                resolve(video);   
            })
        })
    }   

    getVideo(req.params.id).then(function(video){
        console.log(video);
        res.app.render('video-dashboard', {video: video}, function(err, html){
            console.log(err);
            res.send({html:html});
        });
    })
});
module.exports = router;
