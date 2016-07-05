<?php
    session_start();
    
    include 'db.php';
    
    $autenticato=false;
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST'){
        
        $name=$_POST["name"];
        $surname=$_POST["surname"];
        $username=$_POST["username"];
        $email=$_POST["email"];
        $password=$_POST["password"];
        
        $db=new database();
        
        $query ="select * "
                . "from users where email ='" 
                . $db->sanifica_parametro($email)."'";
        
        $risultato = $db->select($query);
        
        if($risultato===false){         
            header("Location: registration.html?err=".$db->get_descrizione_stato());
            die;
        }
        
        if (count($risultato)>0){
                $db->close();
                header("Location: registration.html?errore=existent_email"); 
                exit;
        }
        
        $query = "insert into users values (null,'".$name."','".$surname."','".$email."','".$username."','".$password."')";
        
        $esito = $db->insert($query);
        
        if ($esito){
            setcookie('iduser', $esito, time() + 60*60);
            setcookie('autenticato', TRUE, time() + 60*60);
            $db->close();
            header("Location: profile.php?=reg_succ");
            }
        else{
            $db->close();
            header("Location: registration.html?errore=reg_failed"); 
        }    
            
        exit;
        
    }
    else{
        header("Location: registration.html?err=mustlog");
        exit; 
    }
