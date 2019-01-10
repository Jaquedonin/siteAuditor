var db = require('../database/database');
var findOne = function(codigo) {
    codigo = parseInt(codigo);
    var query = db.getQuery.find("nome", "cidades", "codigo = " + codigo, false, 1)
    return db.doQuery(query);
}

var find = function(body) {

    var where = [];
    var values = [];

    if(body.term){
        where.push("nome LIKE ?");
        values.push("%" + body.term + "%");
    }

    var query = {
        query: db.getQuery.find("codigo as 'id', nome as 'text'", "cidades", where.join(" AND ")),
        values: values
    };

    return db.doQuery(query).catch(function(err) { 
        console.log(err);
    });
}

var getEstatisticas = function(codigo){
    
    codigo = parseInt(codigo);

    return new Promise(function(resolve,reject){
        var query = "SELECT group_concat(distinct cidades.nome) as nome, count(distinct escolas.id) as escolas, count(distinct videos.professor_id) as colaboradores, count(distinct videos.id) as videos FROM cidades" +
        " LEFT JOIN escolas ON escolas.cidade_id = cidades.codigo" +
        " LEFT JOIN videos ON videos.cidade_id = cidades.codigo" +
        " WHERE cidades.codigo = " + codigo;
        
        db.doQuery(query).then(function(results){
            var estatisticas = {
                cidade: {
                    codigo: codigo,
                    nome: results[0].nome,
                },
                n: {
                    colaboradores: results[0].colaboradores,
                    escolas: results[0].escolas,
                    videos: results[0].videos
                }
            }
            resolve(estatisticas);
        })
    });
}

module.exports.findOne = findOne;
module.exports.find = find;
module.exports.getEstatisticas = getEstatisticas;