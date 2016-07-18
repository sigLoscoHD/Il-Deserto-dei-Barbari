<?php
session_start();

include 'db.php';

$_SESSION["punteggio"]+=$_REQUEST["points"];

$points=$_SESSION["punteggio"];

$query="UPDATE users SET punteggio=".$points." WHERE iduser=".$_SESSION['iduser'];

$db=new database();

$risultato=$db->update($query);

$db->close();
