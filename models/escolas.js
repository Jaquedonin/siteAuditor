var db = require('../database/database');
var findOne = function(id) {
    var query = db.getQuery.find("nome", "escolas", "id = " + id, false, 1);
    return db.doQuery(query);
}    

var find = function(params) {

    var where = [];

    if(params.where.term){
        where.push("nome LIKE '%"+ params.where.term + "%'");
    }

    if(params.where.cidade){
        where.push("cidade_id = " + params.where.cidade);
    }

    var query = db.getQuery.find(params.cols, "escolas", where.join(" AND "))
    return db.doQuery(query);
}


module.exports.findOne = findOne;
module.exports.find = find;