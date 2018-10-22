function encodeYouTubeUrl(url) {
    
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) 
    {
        return match[2];
    } 
    else 
    {
        return 'error';
    }
}

function encodeFacebookUrl(url)
{

	return "https://www.facebook.com/plugins/video.php?href="+encodeURI(url)+"&width=500&show_text=false&height=280&appId";
}

function connectDB(connection){
    return new Promise(function(resolve, reject) {
        if(connection.state != "authenticated"){
            connection.connect(function(err){
                if(err){
                    reject({
                        status: 500,
                        error: 1,
                        data: "Internal Server Error"
                    });
                }
            });
        }

        resolve(true);
    });
}

module.exports.encodeYouTubeUrl = encodeYouTubeUrl;
module.exports.encodeFacebookUrl = encodeFacebookUrl;
module.exports.connectDB = connectDB;


