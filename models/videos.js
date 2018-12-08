var db = require('../database/database');
var emojiStrip = require('emoji-strip');
var querystring = require('querystring');

var findByCategoria = function(categorias, params) {
    var queries = [];

    categorias.forEach(function(categoria){
        var query = "SELECT videos.* FROM videos";

        if(categoria.id > 0){
            categoria.id = parseInt(categoria.id);
            query += " INNER JOIN categorias ON categorias.id = videos.categoria_id AND categorias.id = " + categoria.id; 
        }

        if(params.cidade){
            params.cidade = parseInt(params.cidade);
            query += " INNER JOIN cidades ON cidades.codigo = videos.cidade_id AND cidades.codigo = " + params.cidade;
        }
        if(params.escola) {
            params.escola = parseInt(params.escola);
            query += " INNER JOIN escolas ON videos.escola_id = escolas.id AND escolas.id = " + params.escola;
            
            if(params.cidade){
                query += " AND escolas.cidade_id = " + params.cidade;
            }
        }
        
        if(params.busca){
            var busca = db.mysql.escape('%' + params.busca + '%')
            query += " WHERE videos.titulo LIKE "+ busca +" OR videos.descricao LIKE "+ busca;
        }
        query += " ORDER BY videos.views DESC";
        
        queries.push(query);
    });

    var query = queries.join(";");
    return find(query);
}  

var findByCidade = function(cidade){
    var query = db.getQuery.find(false, "videos", "cidade_id = " + cidade, "videos.views DESC", 3);
    return find(query);
}

var findByProfessor = function(professor, params){

    var where = ["professor_id = " + professor];

    if(params){
        if(params.cidade_id)
            where.push("cidade_id = " + params.cidade_id)

        if(params.escola_id)
            where.push("escola_id = " + params.escola_id)

        if(params.busca){
            var busca = db.mysql.escape('%' + params.busca + '%');
            where.push(
            "(titulo LIKE "+busca+" OR descricao LIKE "+busca+")"
            );
        }
    }

    var query = "SELECT id, url, thumb FROM videos WHERE " + where.join(" AND ");
    return find(query);
}

var findById = function(id){
    id = parseInt(id);
    var query = db.getQuery.findOne("*", "videos", id);
    return find(query);
}

var find = function(query){
    return new Promise( async function(resolve, reject){
        var results = await db.doQuery(query);
        results.map(function(item){
            
            /*
             * na galeria, os resultados vem divididos em arrays,
             * uma array para cada cartegoria. é preciso entrar na 
             * array da categoria antes de tratar os videos
             */
            if(Array.isArray(item)){
                item.map(unescapeVideo);
                return item
            } 

            //fora da galeria é possivel tratar o video diretamente
            unescapeVideo(item);
            return item;

        });

        resolve(results);
    })
}

var unescapeVideo = function(video){
    video.autor     = querystring.unescape(video.autor);
    video.url       = querystring.unescape(video.url);
    video.titulo    = querystring.unescape(video.titulo);
    video.thumb     = querystring.unescape(video.thumb);
    video.descricao = querystring.unescape(video.descricao);
            
    return video;
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
        emojiStrip(req.body.autor), 
        req.body.url, 
        emojiStrip(req.body.titulo),
        req.body.thumb,
        emojiStrip(req.body.descricao)
    ];

    var query = db.getQuery.insertOne("videos", cols, vals);
    return db.doQuery(query.query, query.values)
    .then(function(result){
        console.log(result);

        return { status: 200, msg: "Vídeo inserido com sucesso" }
    })
    .catch(function(err) { 
        console.log(err);

        if(err.errno == 1062){
            return { status: 400, msg: "Vídeo já existe no sistema" }
        }

        return { status: 400, msg: "Erro" };
    });
}

var deleteOne = function(id){
    if(!id)
        return false;

    id = parseInt(id);
    var query = db.getQuery.deleteOne("videos", id);
    return db.doQuery(query).then(function(result){
        console.log(result);

        return { status: 200, msg: "Vídeo excluído com sucesso" }
    })
    .catch(function(err) { 
        console.log(err);

        return { status: 400, msg: "Erro ao excluir vídeo" };
    });
}

module.exports.findByCategoria = findByCategoria;
module.exports.findByCidade = findByCidade;
module.exports.findByProfessor = findByProfessor;
module.exports.findById = findById;
module.exports.incrementViews = incrementViews;
module.exports.insertOne = insertOne;
module.exports.deleteOne = deleteOne;