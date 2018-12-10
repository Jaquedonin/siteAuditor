window.fbAsyncInit = function() {
    FB.init({
    	appId      : '460691281030259',
      	xfbml      : true,
        version    : 'v3.0',
        status     : true
    });

    //escutar o player de video do facebook 
    FB.Event.subscribe('xfbml.ready', function(msg) {
        if (msg.type === 'video') {
            fbPlayer = msg.instance;
            onReadyFbVideo();
        }   
    });
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
