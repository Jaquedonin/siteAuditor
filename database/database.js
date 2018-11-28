var mysql = require('mysql');
var query = require('../query');

var pool = mysql.createPool({
    connectionLimit    : 10,
});

doQuery = function (query) {
    var db = this;
    
    return new Promise(function(resolve, reject){
        db.pool.getConnection(function(err, connection) {
            
            if (err) reject(err);
        
            connection.query(query, function (err, result) {
                connection.release();
            
                if (err) reject(err)
                resolve(result);
                
            })
        });
    });
}

module.exports.mysql = mysql;
module.exports.pool = pool;
module.exports.doQuery = doQuery;
module.exports.getQuery = query;
