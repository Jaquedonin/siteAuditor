

var request = require('request');

request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://obras4d.tce.pb.gov.br:33307/api/auth/signin",
    "body": JSON.stringify({
		  "emailOrCpf" : "tceuser@tce.com",
		  "password" : "l4v1d123"
})
}, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    console.dir(JSON.parse(body));
});