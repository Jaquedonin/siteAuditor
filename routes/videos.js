var database = require('../database/database');
var query = require('../query');
var express = require('express');
var router = express.Router();
var functions = require('../include/functions')

//inserir videos
router.post('/videos', function(req, res, next) {

    var cols = ["professor_id", "escola_id", "cidade_id", "categoria_id", "autor", "url", "titulo", "thumb", "descricao"];
	var vals = [
        parseInt(req.session.professorId), 
        parseInt(req.body.escola_id),
        parseInt(req.body.cidade_id), 
        parseInt(req.body.categoria_id), 
        req.body.autor, 
        req.body.url, 
        req.body.titulo,
        req.body.thumb,
        req.body.descricao
    ];
       
    functions.connectDB(database.connection).then(function(){
        database.connection.query(query.insertOne("videos", cols, vals), function (err, result) {
            var status =  err ? 400 : 200;
            return res.redirect(status, '/dashboard');
        }); 
    });
});

router.post('/delete/videos', function(req, res, next) {
	if(req.body.id === undefined){
        return false;
    } else {
        functions.connectDB(database.connection).then(function(){
            database.connection.query(query.deleteOne("videos", req.body.id), function (err, result) {
                var status =  err ? 400 : 200;
                return res.redirect(status, '/dashboard');
            });
        })
	}
});

router.get('/videos', function(req, res, next) {	
	if(req.session.professorId === undefined){
		return res.redirect('/auth');
	} else {
        functions.connectDB(database.connection).then(function(){
            database.connection.query(query.findAllVideos(req.session.professorId), function (err, result) {
                var status =  err ? 400 : 200;
                res.json(status, result);
            }); 
        });
    }
});

module.exports = router;
