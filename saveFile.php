<?php
    $filename = 'JavaScript/test/test.js';
    $test=$_POST['data'];
    $param=$_POST['param'];
    $fp = fopen($filename, 'w');
    fwrite($fp, $test);
    fclose($fp);
?>
