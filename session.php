<?php
    session_start();
    
    if(isset($_SESSION['sid'])){
        if (session_id()== $_SESSION['sid']){
            echo'{"result":{'
                    . '"id":"'.$_SESSION["iduser"].'",'
                    . '"name":"'.$_SESSION["name"].'",'
                    . '"surname":"'.$_SESSION["surname"].'",'
                    . '"email":"'.$_SESSION["email"].'",'
                    . '"password":"'.$_SESSION["password"].'",'
                    . '"username":"'.$_SESSION["username"].'"}}';
        }
    }
    else{
        echo'{"result": "false"}';
}
   

