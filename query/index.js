module.exports = {
	updateOne : function(table, id, url){
		return "UPDATE "+ table +" SET url = '"+url+"' WHERE id = " + id
	},
	deleteOne : function(table, id){
		return "DELETE FROM "+ table +" WHERE id = " + id
	}, 
	findAll : function(table, id){
		return "SELECT * FROM "+ table +" INNER JOIN videos ON professores_escolas.id = videos.professor_escola_id  WHERE professores_escolas.professor_id = " + id

	}
}

