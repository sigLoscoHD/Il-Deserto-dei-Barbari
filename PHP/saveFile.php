<?php
    $filename = '../JavaScript/test/test.js';
    $test=$_POST['data'];
    $fp = fopen($filename, 'w');
    fwrite($fp, $test);
    fclose($fp);
?>
