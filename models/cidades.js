var db = require('../database/database');
var findOne = function(codigo) {
    codigo = parseInt(codigo);
    var query = db.getQuery.find("nome", "cidades", "codigo = " + codigo, false, 1)
    return db.doQuery(query);
}

var find = function(term) {

    var params = {
        cols: "codigo as 'value', nome as 'label'",
        where: { term: db.mysql.escape('%'+ term + '%') }
    }

    var where = [];

    if(params.where){
        if(params.where.term)
            where.push("nome LIKE " + params.where.term);
    }

    var query = db.getQuery.find(params.cols, "cidades", where.join(" AND "))
    return db.doQuery(query);
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