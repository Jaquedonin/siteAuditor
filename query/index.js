var querystring = require('querystring');

module.exports = {
    findOne : function(cols, table, id){
        id = parseInt(id);
        return "SELECT "+cols+" FROM "+table+" WHERE id = " + id;
    },
	insertOne : function(table, columns, values){ 
        var cols = columns.join(",");     
		return {
            query: "INSERT INTO "+ table +" ("+ cols +") VALUES (?)",
            values: [values]
        }
	},
	updateOne : function(table, id, set){
		return "UPDATE "+ table +" SET "+set+" WHERE id = " + id
	},
	deleteOne : function(table, id){
        if(!id)
            return false;
            
        id = parseInt(id);
		return "DELETE FROM "+ table +" WHERE id = " + id
	}, 
	findAll : function(table){
		return "SELECT * FROM "+ table;
	},
    find : function(cols, table, where, order, limit){
        cols = cols || "*";
        
        var query = "SELECT "+ cols +" FROM "+table;
        
        if(where)
            query += " WHERE " + where
        
        if(order)
            query += " ORDER BY " + order
        
        if(limit)
            query += " LIMIT " + limit
        
        return query;
    }
}