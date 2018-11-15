var db = require('../database/database');
var findOne = function(id) {
    var query = db.getQuery.find("nome", "escolas", "id = " + id, false, 1);
    return db.doQuery(query);
}    

var find = function(params) {

    var where = [];

    if(params.term){
        where.push("(nome LIKE '%"+ params.term + "%' OR sigla LIKE '%"+ params.term + "%')");
    }

    if(params.cidade){
        where.push("cidade_id = " + params.cidade);
    }

    var query = db.getQuery.find(
        "id as 'value', CONCAT(sigla, ' - ', nome) as 'label'", 
        "escolas", 
        where.join(" AND ")
    )
    return db.doQuery(query);
}


var insertOne = function(req){
    
    var cols = ["cidade_id", "sigla", "nome"];
    
    var vals = [
        parseInt(req.body.cidade_id), 
        req.body.sigla,
        req.body.nome
    ];

    var query = db.getQuery.insertOne("escolas", cols, vals);
    
    return db.doQuery(query).catch(function(err) { 
        console.log(err);
    });
}


module.exports.find = find;
module.exports.findOne = findOne;
module.exports.insertOne = insertOne;