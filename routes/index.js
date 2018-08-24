var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { 
        title: 'Lavid',
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
