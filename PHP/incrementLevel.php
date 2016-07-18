<?php
session_start();

include 'db.php';

if($_REQUEST['mex']=='get'){
    echo $_SESSION["livello"];
}  
else{
    $num_lev=++$_SESSION["livello"];

    $query="UPDATE users SET livello=".$num_lev." WHERE iduser=".$_SESSION['iduser'];

    $db=new database();
    
    $risultato=$db->update($query);
    
    $db->close();
}