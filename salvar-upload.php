<?php

    if (isset($_POST)) {
        
        $dados = $_POST;

        $fbVideosFile = file_get_contents("fb-videos.json");
        $fbVideos = json_decode($fbVideosFile);
       
        $fbVideos[] = array(
            "user" => $dados['user'],
            "id" => $dados['fb-user-video'],       
            "cidade" => $dados['cidades'],       
            "escola" => $dados['escola']       
        );

        file_put_contents("fb-videos.json", json_encode($fbVideos));
        
    } 

?>