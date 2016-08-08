<?php

session_start();
if ($_SERVER['REQUEST_METHOD'] == 'POST'){
    include 'db.php';

    $query ="select * from users where username <> 'admin' order by punteggio desc";

    $db=new database();

    $risultato = $db->select($query);

       echo '{';

       for($i=0;$i<count($risultato);$i++){
           echo "\"".$risultato[$i]["username"]."\":";
           echo "\"".$risultato[$i]["punteggio"]."\"";
           if($i<count($risultato)-1)
               echo ',';
       }

       echo '}';
}
else{
    header("Location: ../index.html?mex=not_logged"); //non autenticato
    exit; 
}
     
        

    
    

