<?php
session_start();
    
include 'db.php';

$estensione = explode(".",basename($_FILES["fileToUpload"]["name"]))[1];
$target_dir = "../images/";
$target_file = $target_dir . $_SESSION['iduser'].".jpg";

$uploadOk = 1;

if(isset($_POST["submit"])){
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if($check == false) {
        header("Location: ../profile.html?mex=not-image");
        exit;
    } 
}
else{
    header("Location: ../profile.html"); 
    exit;
}

//da vedere se già esiste e la vuole cambiare
if (file_exists($target_file)) {
    echo "Sorry, file already exists.";
    //$uploadOk = 0;
}

// Check file size
if ($_FILES["fileToUpload"]["size"] > 3.5 * 1000 * 1000) {
    header("Location: ../profile.html?mex=large"); 
    exit;
}

if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
    header("Location: ../profile.html?mex=upload");  
    exit;
} 
else {
    //header("Location: ../profile.html?mex=err-upload");
    echo $target_file;
    exit;
}
echo $target_file;

