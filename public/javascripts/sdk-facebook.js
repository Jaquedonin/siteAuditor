window.fbAsyncInit = function() {
    FB.init({
    	appId      : '460691281030259',
      	xfbml      : true,
      	version    : 'v3.0'
    });

    // checkCookies();

   	// FB.getLoginStatus(function(response) {
	// 	statusChangeCallback(response);
	// });
};

(function(d, s, id){
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


var checkLoginState = function() {
	FB.getLoginStatus(function(response) {
		statusChangeCallback(response);
	});
}

var statusChangeCallback = function (response){
	if (response.status ==='connected') {
  		console.log("Usuário autorizado");
  		
  		
  		/* make the API call */
  	} 
  	else{ 
  		console.log("Não autorizado");
  	}
}


var facebookData = function(response){
	for(var i = 0; i < response.posts.data.length; i ++){
		setLinkVideo(response.posts.data[i].link);
		setCookie('url', response.posts.data[i].link, 2);
	}
}

var emberLink 	= function(url){
	return "https://www.facebook.com/plugins/video.php?href="+encodeURI(url)+"&width=500&show_text=false&height=280&appId";
}

var setLinkVideo = function(url){
	$(document).ready(function() {
		var url_embed = emberLink(url);
		$("#player-video").attr('src', url_embed);
	}); 	
};

var checkCookies = function(){
	var url = getCookie('url');
	if(url != "" &&  url != undefined){
		setLinkVideo(url);
	}

}

var setCookie = function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

var getCookie = function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

	
