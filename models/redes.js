var db = require('../database/database');
var find = function() {
    // var query = db.getQuery.find("id, descricao", "rede", false, false, false);
    var query = db.getQuery.find("id, descricao", false, false, false);
    return db.doQuery(query);
    console.log(query);
}    

module.exports.find = find