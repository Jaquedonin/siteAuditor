module.exports = {
	insertOne : function(table, columns, values){ 
        var cols = columns.join(",");
        var vals = "'" + values.join("','") + "'";
        
		return "INSERT INTO "+ table +" ("+ cols +") VALUES("+ vals +")";
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
		return "SELECT id, url, thumb FROM videos WHERE professor_id = " + id
	}
}

