var mysql      = require('mysql');

var connection = mysql.createConnection({
    //connectionLimit    : 100,
    host               : 'us-cdbr-iron-east-01.cleardb.net',
    port               : 3306,
    user               : 'be7f7ab045f386',
    password           : 'ff84709c',
    database           : 'heroku_b06458221811ff6',
    //multipleStatements : true
});

module.exports.connection = connection;