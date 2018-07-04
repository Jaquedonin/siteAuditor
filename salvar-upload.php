<?php

    if (isset($_POST)) {
        
        $dados = $_POST;

        $fbVideosFile = file_get_contents("fb-videos.json");
        $fbVideos = json_decode($fbVideosFile);
       
        $fbUserVideo = explode("/", $dados['fb-user-video']);

        $fbVideos[] = array(
            "user" => $fbUserVideo[0],
            "id" =>  $fbUserVideo[1],       
            "cidade" => $dados['cidades'],       
            "escola" => $dados['escola']       
        );

        file_put_contents("fb-videos.json", json_encode($fbVideos));
        
    } 

?>