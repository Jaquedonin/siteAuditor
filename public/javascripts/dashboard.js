window.onload = function(){
    FB.getLoginStatus(function(response) {
        getFbUserVideos();
    });
}