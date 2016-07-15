function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}


var user; //variabile che serve a contenere i dati

// chiamata ajax che esegue il file session.php e restituisce il risultato in data.
$.ajax({
    url:"PHP/session.php",
    type:"get",
    dataType: 'text',
    async:false,
    success:function(data){
                user=data;
            }
    });

// parsing della variabile user in file JSON
var userJSON = JSON.parse(user);

// colorazione livelli completati sul profilo utente 
for(var i=0;i<userJSON.result.livello;i++){
    $("#"+i).addClass("completed");
    $("#text"+i).addClass("completed");
}

// Dati pagina html(profile.html) impostati sulla base della sessione utente
if(userJSON.result!= "false"){
    $('#name').val(userJSON.result.name);
    $('#surname').val(userJSON.result.surname);
    $('#email').val(userJSON.result.email);
    $('#username').val(userJSON.result.username);
    $('#password').val(userJSON.result.password);
    $("#nav").append("<li id='profile'><a href='profile.html'> Profile</a></li>");
    $("#nav").append("<li id='logout'><a href='PHP/logout.php'>Logout</a></li>");
    $("#login").remove();
    $("#sign").remove();
    $("#play").attr("href","game.html");
}
else{
    $("#play").attr("href","login.html?mex=must_log");
    $("#nav").append("<li id='login'><a href='login.html'>Login</a></li>");
    $("#nav").append("<li id='sign'><a href='registration.html'>Sign Up</a></li>");
    $("#logout").remove();
    $("#profile").remove();
}
    
    


             
