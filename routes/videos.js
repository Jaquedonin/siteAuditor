var database = require('../database/database');
var query = require('../query');
var express = require('express');
var router = express.Router();
var functions = require('../include/functions')

//inserir videos
router.post('/videos', function(req, res, next) {
	//variables to test url Facebook and Youtube 

	var regexYouTube = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
	var regexFacebook = /(?:http:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/;

	if(regexYouTube.test(req.body.url))
	{
		console.log(functions)
		var url_embed = 'https://youtube.com/embed/'+functions.encodeYouTubeUrl(req.body.url);
		
	}
	else if(regexFacebook.test(req.body.url))
	{
		var url_embed = functions.encodeFacebookUrl(req.body.url);	
	}
	else
	{
		var url_embed = "Erro em url_embed";
	}

	var data = [req.session.professorEscolaId, url_embed , req.body.codigo];
	database.connection.query(query.insertOne("videos", data ), function (err, result) {
		if(err){
			res.setHeader('Content-Type', 'application/json');
			return res.status(400).send(err);
		}
		else{
			return res.redirect('/dashboard');
		}
	});
});


router.post('/delete/videos', function(req, res, next) {
	if(req.body.id === undefined)
		return false;
	else{
		database.connection.query(query.deleteOne("videos", req.body.id), function (err, result) {
			if(err){
				res.setHeader('Content-Type', 'application/json');
				return res.status(400).send(err);
			}
			else{
				return res.redirect('/dashboard');
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
		database.connection.query(query.findAllVideos("professores_escolas", req.session.professorId), function (err, result) {
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
