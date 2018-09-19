module.exports = {
	updateOne : function(table, id, url){
		return "UPDATE "+ table +" SET url = '"+url+"' WHERE id = " + id
	},
	deleteOne : function(table, id){
		return "DELETE FROM "+ table +" WHERE id = " + id
	}, 
	findAll : function(table, id){
		return "SELECT * FROM "+ table +" WHERE professor_id = " + id
    },
    insertOne: function (table){
        return "INSERT INTO " + table + " SET ?"
    }
}

