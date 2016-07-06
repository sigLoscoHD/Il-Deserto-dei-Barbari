<?php
    session_start();
    
    include 'db.php';

    $autenticato=false;

    
 
    if ($_SERVER['REQUEST_METHOD'] == 'POST')
    {
        $email = $_POST['email'];
        $psw = $_POST['password'];
                
        $db=new database();

        $query ="select * "
                . "from users where email ='" 
                . $db->sanifica_parametro($email)."'"; 

        //2 inviare il comando
        $risultato = $db->select($query);
        
        if($risultato===false){
            header("Location: login.html?mex=".$db->get_descrizione_stato());
            die;
        }      

        if (count($risultato)>0){
            $riga=$risultato[0];
            $autenticato=($psw === $riga['password']);
        }

        //4 chiudere la/le connessione/i
        $db->close();

        //redirect
        if($autenticato){
            setcookie('iduser', $riga["iduser"], time() + 60*60);
            setcookie('autenticato', TRUE, time() + 60*60);         
            header("Location: profile.php?mex=log_succ");
            exit;
        }
        else{
             header("Location: login.html?mex=login_failed");
             exit;
        }
    }   
    else{
        header("Location: login.html?mex=not_logged"); //non autenticato
        exit; 
    }