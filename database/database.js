var mysql      = require('mysql');

var connection = mysql.createConnection({
    connectionLimit    : 100,
    host               : 'localhost',
    port               : 3306,
    user               : 'connie',
    password           : 'W3u7$@aC',
    database           : 'tce-mapa',
    multipleStatements : true
});

module.exports.connection = connection;