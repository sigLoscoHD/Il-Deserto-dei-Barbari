<?php
session_start();

if(isset($_SESSION['sid'])){
        if (session_id()== $_SESSION['sid'])
            echo $_SESSION['livello'];
}