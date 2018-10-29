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

module.exports.connectDB = connectDB;


