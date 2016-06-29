<?php
    $filename = 'JavaScript/missile_command.js';
    $test=$_POST['data'];
    $fp = fopen($filename, 'w');
    fwrite($fp, $test);
    fclose($fp);
?>
