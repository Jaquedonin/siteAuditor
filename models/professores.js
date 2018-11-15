var db = require('../database/database');

var insertOne = function(req){
    var query = db.getQuery.insertOne(
        "professores", 
        ["email", "senha"], 
        [req.body.email, req.body.senha]
    );
    return db.doQuery(query);
}

var find = function(params) {
    var where = [];

    if(params.where){
        if(params.where.email)
            where.push("email = '"+ params.where.email + "'");
    }
    
    var query = db.getQuery.find("id, senha", "professores", where.join(" AND "))
    return db.doQuery(query);
}

module.exports.insertOne = insertOne;
module.exports.find = find;