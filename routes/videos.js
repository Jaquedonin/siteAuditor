var database = require('../database/database');
var query = require('../query');
var express = require('express');
var router = express.Router();
var emojiStrip = require('emoji-strip')

//inserir videos
router.post('/videos', function(req, res, next) {

    var cols = [
        "professor_id", 
        "escola_id", 
        "cidade_id", 
        "categoria_id", 
        "autor", 
        "url", 
        "titulo", 
        "thumb", 
        "descricao"
    ];
	var vals = [
        parseInt(req.session.professorId), 
        parseInt(req.body.escola_id),
        parseInt(req.body.cidade_id), 
        parseInt(req.body.categoria_id), 
        emojiStrip(req.body.autor), 
        req.body.url, 
        emojiStrip(req.body.titulo),
        req.body.thumb,
        emojiStrip(req.body.descricao)
    ];
    
    database.pool.getConnection(function(err, connection) {
        connection.query(query.insertOne("videos", cols, vals), function (err, result) {
            connection.release();

            req.session.insert = {
                status: err ? 400 : 200,
                msg: err ? err : "Vídeo inserido com sucesso!"
            }
            
            return res.redirect('/dashboard');
        }); 
    });
});

//excluir videos
router.post('/delete/videos', function(req, res, next) {
    
    if(req.body.id === undefined){
        return false;
    } else {
        
        return database.pool.getConnection(function(err, connection) {
            return connection.query(query.deleteOne("videos", req.body.id), function (err, result) {
                connection.release();

                req.session.delete = {
                    status: err ? 400 : 200,
                    msg: err ? err : "Vídeo excluído com sucesso!"
                }

                return res.redirect('/dashboard');
            });
        });

	}
});

router.get('/videos', function(req, res, next) {	
	if(req.session.professorId === undefined){
		return res.redirect('/auth');
	} else {
        database.pool.getConnection(function(err, connection) {
            connection.query(query.findAllVideos(req.session.professorId), function (err, result) {
                connection.release();
                if(err) res.json(400, false);
                
                res.json(200, result);
            }); 
        });
    }
});

module.exports = router;
