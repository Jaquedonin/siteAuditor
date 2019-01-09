var querystring = require('querystring');
var db = require('../database/database');

var findOne = function(id) {
    id = parseInt(id);

    var query = db.getQuery.find("nome", "escolas", "id = " + id, false, 1);
    return db.doQuery(query).catch(function(err) { 
        console.log(err);
    });
}    

var find = function(body) {

    var where = [];
    var values = [];

    if(body.term){
        where.push("(nome LIKE ? OR sigla LIKE ? )");
        values.push("%" + body.term + "%");
        values.push("%" + body.term + "%");
    }

    if(body.cidade){
        where.push("cidade_id = ?");
        values.push(body.cidade);
    }

    if(body.rede_id > 0){
        where.push("rede_id = ?");
        values.push(body.rede_id);
    }

    var query = {
        query: db.getQuery.find(
            "id as 'value', CONCAT(sigla, ' - ', nome) as 'label'", 
            "escolas", 
            where.join(" AND ")
        ),
        values: values
    };
    
    return db.doQuery(query).catch(function(err) { 
        console.log(err);
    });
}

var insertOne = function(req){
    
    var cols = ["cidade_id", "sigla", "nome"];
    
    var vals = [
        parseInt(req.body.cidade_id), 
        querystring.escape(req.body.sigla),
        querystring.escape(req.body.nome),
        parseInt(req.body.rede_id),
    ];

    var query = db.getQuery.insertOne("escolas", cols, vals);
    
    return db.doQuery(query).catch(function(err) { 
        console.log(err);
    });
}

module.exports.find = find;
module.exports.findOne = findOne;
module.exports.insertOne = insertOne;