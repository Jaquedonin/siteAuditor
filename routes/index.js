var express = require('express');
var router = express.Router();

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('./database/data.json', 'utf8'));


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', data);
});

router.get('/bem-vindo', function(req, res, next) {
    res.render('bem-vindo', data);
});

router.get('/dashboard', function(req, res, next) {
    res.render('dashboard', data);
});

router.get('/auth', function(req, res, next) {
    res.render('auth', { 
        title: 'Auth',
        escola: {
            nome: 'E.E.P Euniz Argemiro',
            cidade: 'João Pessoa'
        },
        user:  {
            nome: 'Maria José Gonçalves',
            foto: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2300002206678298&height=50&width=50&ext=1537571297&hash=AeTfvLLcNA-8aRmh'
        }
    });
});

module.exports = router;
