<?php

    include 'db.php';

    $id=$_REQUEST["id"];
    
    $db=new database();

    $query ="select * from file where id=".$id;

    $risultato = $db->select($query);
    
    //risultato === false vuol dire che è andato male qualcosa nella query
    if($risultato===false){
        echo "ci sta qualcosa che non va nella query";
        die;
        }      

    if (count($risultato)>0){
        $file=$risultato[0];

        $content=$file["content"];

        $fw = fopen("test", 'w');
        
        fwrite($fw, $content);

        fclose($fw);
        
        
    }