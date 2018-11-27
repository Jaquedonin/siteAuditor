var mysql = require("mysql");

module.exports = {
    findOne : function(cols, table, id){
        id = parseInt(id);
        return "SELECT "+cols+" FROM "+table+" WHERE id = " + id;
    },
	insertOne : function(table, columns, values){ 

        var cols = columns.join(",");
        var vals = values.map(mysql.escape).join(",");        
        
		return "INSERT INTO "+ table +" ("+ cols +") VALUES("+ vals +")";
	},
	updateOne : function(table, id, set){
        set = mysql.escape(set);
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