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
            die;
        }
        
        if (count($risultato)>0){
                $db->close();
                header("Location: registration.html?mex=existent_email"); 
                exit;
        }
        
        $query = "insert into users values (null,'".$name."','".$surname."','".$email."','".$username."','".$password."')";
        
        $esito = $db->insert($query);
        
        if ($esito){
            setcookie('iduser', $esito, time() + 60*60);
            setcookie('autenticato', TRUE, time() + 60*60);
            $db->close();
            header("Location: profile.html?mex=reg_succ");
            }
        else{
            $db->close();
            header("Location: registration.html?mex=reg_failed"); 
        }    
            
        exit;
        
    }
    else{
        header("Location: registration.html?err=must_log");
        exit; 
    }
