<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <!-- CSS import -->
        <link href="bootstrap-3.3.6-dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="CSS/stile.css" rel="stylesheet">
        <link href="CSS/profile.css" rel="stylesheet" type="text/css"/>
        <!-- JS import -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="bootstrap-3.3.6-dist/js/bootstrap.min.js"></script>
        <title>Profile</title>
    </head>
    <body>
        <div id="menu">
        <nav class="navbar navbar-default">
         <div class="container-fluid">
         <!-- Brand -->
          <div class="navbar-header">
           <a class="navbar-brand" href="home.html">Learn JavaScript</a>
         </div>
         <!-- Voci della navbar -->
         <div class="collapse navbar-collapse" id="voci-nav">
           <ul class="nav navbar-nav">
             <li><a href="game.html"> Play!</a></li>
             <li><a href="profile.php"> Profile</a></li>
             <li><a href="aboutUs.html"> About Us</a></li>
           </ul>
         </div><!-- /.navbar-collapse -->
       </div><!-- /.container-fluid -->
     </nav>
    </div>
      <!-- profile -->
    <div class="container">
        <div class="row">
          <!-- left column -->
          <div class="col-md-4 col-sm-6 col-xs-12">
            <div class="text-center">
                <img src="images/tac.PNG" class="avatar img-circle img-thumbnail" alt="avatar">
              <h6>Upload a new photo</h6>
              <input type="file" class="text-center center-block well well-sm">
            </div>
          </div>
          <!-- edit form column -->
          <div class="col-md-8 col-sm-6 col-xs-12 personal-info">
            <h1>Personal info</h1>
            <form class="form-horizontal" role="form">
              <div class="form-group">
                <label class="col-lg-3 control-label">First name:</label>
                <div class="col-lg-8">
                  <input class="form-control" value="Simone" type="text">
                </div>
              </div>
              <div class="form-group">
                <label class="col-lg-3 control-label">Last name:</label>
                <div class="col-lg-8">
                  <input class="form-control" value="Passaretti" type="text">
                </div>
              </div>
              <div class="form-group">
                <label class="col-lg-3 control-label">Email:</label>
                <div class="col-lg-8">
                  <input class="form-control" value="simobig93@gmail.com" type="text">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label">Username:</label>
                <div class="col-md-8">
                  <input class="form-control" value="big93" type="text">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label">Password:</label>
                <div class="col-md-8">
                  <input class="form-control" value="tacchino" type="password">
                </div>
              </div>
              <div class="form-group">
                <label class="col-md-3 control-label">Confirm password:</label>
                <div class="col-md-8">
                  <input class="form-control" value="tacchino" type="password">
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
        
    </body>
</html>
