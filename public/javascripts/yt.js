
var CLIENT_ID = '1067903977029-jmr53fp75kf7vk4j4rc65qd77em7rcb7.apps.googleusercontent.com';
var OAUTH2_SCOPES = [
  'https://www.googleapis.com/auth/youtube'
];

window.addEventListener("load", function(){
    initYt();

    document.getElementById('yt-btn').addEventListener("click", function(){
        var url = document.getElementById('yt-link').value;
        if(url.match("[\?&]v=([^&#]*)") != null){
            videoId = url.match("[\?&]v=([^&#]*)")[1];

            
            execute(videoId)
        }

        
    })
});


  function initYt() {
    gapi.client.setApiKey("AIzaSyA_l5mfOIWiR437wfKU3fU-8c2FS36uf48");
    gapi.client.load("youtube", "v3", function(){
        console.log("ready!");
    });
        
  }

  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute(id) {
    return gapi.client.youtube.search.list({
      "part": "snippet",
      "type": "video",
      "q": id
    }).then(function(response) {
                console.log(response.result.items[0].snippet);
        },
        function(err) { console.error("Execute error", err); });
  }