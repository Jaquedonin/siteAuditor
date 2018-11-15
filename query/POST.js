
var requesting = function(email,senha){
	var request = require('request');
	request.post({
	    "headers": { "content-type": "application/json" },
	    "url": "http://obras4d.tce.pb.gov.br:33307/api/auth/signin",
	    "body": JSON.stringify({
			  emailOrCpf : email,
			  password : senha
	})
	}, (error, response, body) => {
	    if(!error) {
	        return false;
	    }
	    //console.dir(body);
	    return true;

	    
	});
}

//requisicao("tceuser@tce.com", "l4v1d123");
module.exports.requesting = requesting;