var database = require('../database/database');
var query = require('../query');
var express = require('express');
var router = express.Router();


router.put('/videos', function(req, res, next) {
	if(req.body.id === undefined)
		return false;
	else{
		database.connection.query(query.updateOne("videos", req.body.id, req.body.url), function (err, result) {
			if(err){
				res.setHeader('Content-Type', 'application/json');
				return res.status(400).send(err);
			}
			else{
				res.setHeader('Content-Type', 'application/json');
				res.json(result);
				res.end('video')
			}
		});
	}
});

router.delete('/videos', function(req, res, next) {
	if(req.body.id === undefined)
		return false;
	else{
		database.connection.query(query.deleteOne("videos", req.body.id), function (err, result) {
			if(err){
				res.setHeader('Content-Type', 'application/json');
				return res.status(400).send(err);
			}
			else{
				res.setHeader('Content-Type', 'application/json');
				res.json(result);
				res.end('video')
			}
		});
	}
});

router.get('/videos/:id', function(req, res, next) {	

	if(req.params.id === undefined){
		return res.status(400).send(err);
	}
	else{
		database.connection.query(query.findAll("videos", req.params.id), function (err, result) {
			if(err){
				res.setHeader('Content-Type', 'application/json');
				return res.status(400).send(err);
			}
			else{
				res.setHeader('Content-Type', 'application/json');
				res.json(result);
				res.end('video')
			}
		}); 	
	}
});

router.post('/videos', function(req, res, next) {

    console.log(req.body);
    res.contentType('json');
    res.send(req.body);
    
    return;

	if(req.body.url === undefined)
		return false;
	else{

        var userData = {
            fb_user: req.body["fb-register-user"], 
            email: req.body.email,
            senha: req.body.senha
        };

		database.connection.query(query.insertOne("videos"), [values], function (err, result) {
			if(err){
				res.setHeader('Content-Type', 'application/json');
				return res.status(400).send(err);
			}
			else{
				res.setHeader('Content-Type', 'application/json');
				res.json(result);
				res.end('video')
			}
		});
	}
});

module.exports = router;
