var db = require('../database/database');
var find = function() {
    var query = db.getQuery.find("id, descricao", "redes", false, false, false);
    return db.doQuery(query);
}  

module.exports.find = find