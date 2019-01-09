var db = require('../database/database');
var find = function() {
    var query = db.getQuery.find("id, descricao", "redes", false, false, false);
    return db.doQuery(query);
}  

var findOne = function(id) {
    id = parseInt(id);

    var query = db.getQuery.find("descricao", "redes", "id = " + id, false, 1);
    return unescape(query);
}    


module.exports.find = find
module.exports.findOne = findOne