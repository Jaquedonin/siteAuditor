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

router.get('/videos', function(req, res, next) {	
	if(req.session.professorId === undefined){
		console.log("redirect login")
		return res.redirect('/auth');
	}
	else{
		console.log(req.session.professorId)
		database.connection.query(query.findAll("professores_escolas", req.session.professorId), function (err, result) {
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
