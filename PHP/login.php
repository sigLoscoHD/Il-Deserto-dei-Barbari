<?php
    session_start();
    
    include 'db.php';

    $autenticato=false;
    
    // controllo se request method ritorna POST
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST')
    {
        $email = $_POST['email'];
        $psw = $_POST['password'];
        
        // creazione istanza, viene richiamato il costruttore
        $db=new database();
        
        // costruisco la mia query
        $query ="select * "
                . "from users where email ='" 
                . $db->sanifica_parametro($email)."'"; // per motivi di sicurezza sanifico parametro

        /*
         * Esecuzione della query e assegnazione alla variabile risulato.
         * Il risultato della query è un array php chiave-valore.
         */
        
        $risultato = $db->select($query);
        
        //se la query è errata
        if($risultato===false){
            die;
        }      
        
        if (count($risultato)>0){
            $riga=$risultato[0];
            $autenticato=($psw === $riga['password']); // controllo se password corrisponde
        }

        //4 chiudere la/le connessione/i
        $db->close();

        //redirect
        if($autenticato){
            $_SESSION['sid']=session_id();
            $_SESSION['iduser']=$riga["iduser"];
            $_SESSION['name']=$riga["name"];
            $_SESSION['surname']=$riga["surname"];
            $_SESSION['email']=$riga["email"];
            $_SESSION['username']=$riga["username"];
            $_SESSION['password']=$riga["password"];
            $_SESSION['livello']=$riga["livello"];
            $_SESSION['punteggio']=$riga["punteggio"];
            header("Location: ../profile.html?mex=log_succ"); // redirect al profilo
            exit;
        }
        else{
             header("Location: ../login.html?mex=login_failed"); 
             exit;
        }
    }   
    else{
        header("Location: ../index.html?mex=not_logged"); //non autenticato
        exit; 
    }