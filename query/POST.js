
var requesting = function(email,senha){
	var request = require('request');
	return new Promise(function(resolve, reject)
	{
		request.post({
		    "headers": { "content-type": "application/json" },
		    "url": "http://150.165.204.115:8081/api/map/users",
		    "body": JSON.stringify({
				  emailOrCpf : email,
				  password : senha
		})
		}, (error, response, body) => 
		{
			var response = JSON.parse(body);
			//console.log(response.status );
		    if (response.status == 401) 
            {
               // var result = [false];
				 //console.log(body);
				var result = [false];
                resolve(false);

            }
            
            
            var response = JSON.parse(body);
		    var result = [response.name, response.email ];
		   // {result: {email: response.name}};
		    //console.dir(result);
		    resolve({name: response.name, email: response.email});
		    		    
		    //console.dir(response);
		    //console.dir(body);
		    //return true;
            
            

		    
		});
	});
}

/*requesting("tceuser@tce.com", "l4v1d123").then(function(result){
	//console.log("resolve");
		if(result != false){
			console.log("reason");
			console.log(result.name);
			//console.log(result[1]);	
		}
		//console.log(resolve[0]);
	

});
	
*/


module.exports.requesting = requesting;

