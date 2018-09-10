var database 	= 	require('./BD');

database.con.connect(function(err) {
	if(err) {
		console.log("No Connected!");} 
	else {            
        	console.log("Connected!");}

    
	database.con.query("SELECT fb_user, email, id FROM professores", function (err, result, fields) {
		  if (err) throw err;
		  console.log(result);
	});

	function listarVideos(id_professor){
		var sql = 'SELECT url FROM videos INNER JOIN professores ON  videos.professor_escola_id = professores.id';
		database.con.query(sql, function (err, result) {
			if(err) { console.log("Error 01!"); } 
			else {
            console.log(result);
			return result; }
		});
 	} module.exports.listarVideos = listarVideos;

 	//funcionanado excluso
 	function excluirVideos(videos_id){
 		var sql = 'DELETE FROM videos WHERE id = '+videos_id;
 		database.con.query(sql, function (err, result) {
			if(err) { console.log("Error 02!"); } 
			else {
            
			return (console.log("Number of records deleted: " + result.affectedRows)); }
		});
 	} module.exports.excluirVideos = excluirVideos;

 	function alterUrl(url, videos_id ){
 		var sql = 'UPDATE videos SET url = '+url +'WHERE videos.id = '+videos_id;
 		database.con.query(sql, function (err, result) {
			if(err) { console.log("Error 03!"); } 
			else {
			return (console.log("Number of records altered: " + result.affectedRows)); }
		});
 	} module.exports.alterUrl = alterUrl;

 	function alterDescri(descricao, categorias_id ){
 		var sql = 'UPDATE categorias SET descricao = '+descricao +'WHERE categorias.id = '+categorias_id;
 		database.con.query(sql, function (err, result) {
			if(err) { console.log("Error 03!"); } 
			else {
			return (console.log("Number of records altered: " + result.affectedRows)); }
		});
 	} module.exports.alterDescri = alterDescri;


});
