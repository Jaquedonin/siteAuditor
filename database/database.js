var mysql      = require('mysql');

var pool = mysql.createPool({
    connectionLimit    : 10,
});

module.exports.pool = pool;