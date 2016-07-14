<?php
    session_start();
    // controlla se la sessione è settata per il sid (session id)
    if(isset($_SESSION['sid'])){
        if (session_id()== $_SESSION['sid']){
            echo'{"result":{'
                    . '"id":"'.$_SESSION["iduser"].'",'
                    . '"name":"'.$_SESSION["name"].'",'
                    . '"surname":"'.$_SESSION["surname"].'",'
                    . '"email":"'.$_SESSION["email"].'",'
                    . '"password":"'.$_SESSION["password"].'",'
                    . '"livello":"'.$_SESSION["livello"].'",'
                    . '"username":"'.$_SESSION["username"].'"}}';
        }
    }
    else{
        echo'{"result": "false"}';
}
   

