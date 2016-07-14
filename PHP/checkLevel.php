<?php
session_start();

// se sono connesso restituisce il livello utente
if(isset($_SESSION['sid'])){
        if (session_id()== $_SESSION['sid'])
            echo $_SESSION['livello'];
}