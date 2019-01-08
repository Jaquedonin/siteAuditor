var querystring = require('querystring');
var db = require('../database/database');

var findOne = function(id) {
    id = parseInt(id);

    var query = db.getQuery.find("nome", "escolas", "id = " + id, false, 1);
    return unescape(query);
}    

var find = function(body) {

    var params = {
        term: "'%" + querystring.escape(body.term) + "%'",
        cidade: querystring.escape(body.cidade),
        insert: querystring.escape(body.insert_escola)
    }
    var where = [];

    if(params.term){
        where.push("(nome LIKE "+ params.term +" OR sigla LIKE "+ params.term +")");
    }

    if(params.cidade){
        where.push("cidade_id = " + params.cidade);
    }

    var query = db.getQuery.find(
        "id as 'value', CONCAT(sigla, ' - ', nome) as 'label'", 
        "escolas", 
        where.join(" AND ")
    )

    return unescape(query);
}

function unescape(query){
    return new Promise( async function(resolve, reject){
        var results = await db.doQuery(query);
        results.map(function(escola){
            
            for (var field in escola){
                escola[field]  = querystring.unescape(escola[field]);
            }
            return escola;
        });

        resolve(results);
    })
}

var insertOne = function(req){
    
    var cols = ["cidade_id", "sigla", "nome"];
    
    var vals = [
        parseInt(req.body.cidade_id), 
        querystring.escape(req.body.sigla),
        querystring.escape(req.body.nome),
        // parseInt(req.body.rede_id),
    ];

    var query = db.getQuery.insertOne("escolas", cols, vals);
    
    return db.doQuery(query).catch(function(err) { 
        console.log(err);
    });
}

module.exports.find = find;
module.exports.findOne = findOne;
module.exports.insertOne = insertOne;