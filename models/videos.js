var db = require('../database/database');
var emojiStrip = require('emoji-strip');

var findByCategoria = function(categorias, params) {
    var queries = [];

    categorias.forEach(function(categoria){
        var query = "SELECT videos.* FROM videos";

        if(categoria.id > 0)
            query += " INNER JOIN categorias ON categorias.id = videos.categoria_id AND categorias.id = " + categoria.id; 
           
        if(params.cidade)
            query += " INNER JOIN cidades ON cidades.codigo = videos.cidade_id AND cidades.codigo = " + params.cidade;
        
        if(params.escola) {
            query += " INNER JOIN escolas ON videos.escola_id = escolas.id AND escolas.id = " + params.escola;
            
            if(params.cidade){
                query += " AND escolas.cidade_id = " + params.cidade;
            }
        }
        
        if(params.busca)
            query += " WHERE videos.titulo LIKE '%" + params.busca + "%' OR videos.descricao LIKE '%" + params.busca + "%'";

        query += " ORDER BY videos.views DESC";
        
        queries.push(query);
    });

    var query = queries.join(";");
    return db.doQuery(query);
}  

var findByCidade = function(cidade){
    var query = db.getQuery.find(false, "videos", "cidade_id = " + cidade, "videos.views DESC");
    return db.doQuery(query);
}

var findByProfessor = function(professor, params){

    var where = ["professor_id = " + professor];

    if(params){
        if(params.cidade_id)
            where.push("cidade_id = " + params.cidade_id)

        if(params.escola_id)
            where.push("escola_id = " + params.escola_id)

        if(params.busca)
            where.push(
            "(titulo LIKE '%" + params.busca + "%'" +
            " OR descricao LIKE '%" + params.busca + "%')"
            );
    }

    var query = "SELECT id, url, thumb FROM videos WHERE " + where.join(" AND ");
    
    return db.doQuery(query);
}

var findById = function(id){
    id = parseInt(id);
    var query = db.getQuery.findOne("*", "videos", id);
    return db.doQuery(query);
}

var incrementViews = function(id){
    id = parseInt(id);
    var query = db.getQuery.updateOne("videos", id, "views = views + 1");
    return db.doQuery(query);
} 

var insertOne = function(req){
    
    var cols = [
        "professor_id", 
        "escola_id", 
        "cidade_id", 
        "categoria_id", 
        "autor", 
        "url", 
        "titulo", 
        "thumb", 
        "descricao"
    ];
    
    var vals = [
        parseInt(req.session.professorId), 
        parseInt(req.body.escola_id),
        parseInt(req.body.cidade_id), 
        parseInt(req.body.categoria_id), 
        db.mysql.escape(emojiStrip(req.body.autor)), 
        db.mysql.escape(req.body.url), 
        db.mysql.escape(emojiStrip(req.body.titulo)),
        db.mysql.escape(req.body.thumb),
        db.mysql.escape(emojiStrip(req.body.descricao))
    ];

    var query = db.getQuery.insertOne("videos", cols, vals);
    return db.doQuery(query).catch(function(err) { 
        console.log(err);
    });
}

var deleteOne = function(id){
    if(!id)
        return false;

    id = parseInt(id);
    var query = db.getQuery.deleteOne("videos", id);
    return db.doQuery(query);
}

module.exports.findByCategoria = findByCategoria;
module.exports.findByCidade = findByCidade;
module.exports.findByProfessor = findByProfessor;
module.exports.findById = findById;
module.exports.incrementViews = incrementViews;
module.exports.insertOne = insertOne;
module.exports.deleteOne = deleteOne;