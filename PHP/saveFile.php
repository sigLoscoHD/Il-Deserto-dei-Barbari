<?php
    session_start();
   
    $filename = '../JavaScript/test/'. $_SESSION['iduser'].'.js';
    
    $test=$_POST['data'];
    $fp = fopen($filename, 'w');
    fwrite($fp, $test);
    fclose($fp);
?>
