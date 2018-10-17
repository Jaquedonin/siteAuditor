module.exports = {
	insertOne : function(table, data){
		return "INSERT INTO "+ table +" (professor_escola_id, url, cidade, categoria_id, titulo) VALUES("+data[0]+", '"+data[1]+"', '"+data[2]+"',"+data[3]+",'"+data[4]+"' )"
	},
	updateOne : function(table, id, url){
		return "UPDATE "+ table +" SET url = '"+url+"' WHERE id = " + id
	},
	deleteOne : function(table, id){
		return "DELETE FROM "+ table +" WHERE id = " + id
	}, 
	findAll : function(table){
		return "SELECT * FROM "+ table;

	},
	findAllVideos : function(id){
		return "SELECT videos.id as id, videos.url as url FROM videos INNER JOIN professores_escolas ON professores_escolas.id = videos.professor_escola_id  WHERE professores_escolas.professor_id = " + id
	}
}

