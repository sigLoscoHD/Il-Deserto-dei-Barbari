<?php
    session_start();
    // controlla se la sessione è settata per il sid (session id)
    if(isset($_SESSION['sid'])){
        // se id della sessione corrisponde a quello dell'utente
        if (session_id()== $_SESSION['sid']){ // session_id() returns the session id for the current session or the empty string ("") if there is no current session 
            // ritorna tutti i dati della sessione utente, in una sintassi JSON
            echo'{"result":{'
                    . '"id":"'.$_SESSION["iduser"].'",'
                    . '"name":"'.$_SESSION["name"].'",'
                    . '"surname":"'.$_SESSION["surname"].'",'
                    . '"email":"'.$_SESSION["email"].'",'
                    . '"password":"'.$_SESSION["password"].'",'
                    . '"livello":"'.$_SESSION["livello"].'",'
                    . '"punteggio":"'.$_SESSION["punteggio"].'",'
                    . '"username":"'.$_SESSION["username"].'"}}';
        }
    }
    else{
        echo'{"result": "false"}';
}
   

