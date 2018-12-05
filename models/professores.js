var db = require('../database/database');

var insertOne = function(email, nome){
    var query = db.getQuery.insertOne(
        "professores", 
        ["email", "nome"], 
        [db.mysql.escape(email), db.mysql.escape(nome)]
    );

    return db.doQuery(query);
}

var find = function(email) {
    email = db.mysql.escape(email);
    var query = db.getQuery.find("id", "professores", "email =" + email);
    return db.doQuery(query);
}

var findTCE = function(email, senha){
    
    var request = require('request');
    
    return new Promise(function(resolve, reject){
        request.post({
            "headers": { "content-type": "application/json" },
            "url": "http://150.165.204.115:8081/api/map/users",
            "body": JSON.stringify({
                  emailOrCpf : email,
                  password : senha
            })
        }, (error, response, body) => 
        {
            
            var response = JSON.parse(body);
            
            if (response.status) {
                console.log("Erro no login:", email, response.status, response.error, response.message);
                resolve(false);
            } else {
                resolve({name: response.name, email: response.email});
            } 
            
        });
    });
}

module.exports.insertOne = insertOne;
module.exports.find = find;
module.exports.findTCE = findTCE;