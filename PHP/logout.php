<?php
session_start();

session_unset();
session_destroy();

header("Location: ../home.html?mex=suc_logout");