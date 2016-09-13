//grado e punti del grado del giocatore
var grado={};
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

getGrado(userJSON.result.punteggio);
// colorazione livelli completati sul profilo utente 
for(var i=0;i<userJSON.result.livello;i++){
    $("#"+i).addClass("completed");
    $("#text"+i).addClass("completed");
    //controllo sblocco trofei delle macro sezioni e relativa colorazione
    if (i>=3){
        $("#debug").addClass("completed");
        $("#debug-text").addClass("completed");
    }
    if (i>=6){
        $("#refactor").addClass("completed");
        $("#refactor-text").addClass("completed");
    }
    if (i>=9){
        $("#design").addClass("completed");
        $("#design-text").addClass("completed");
    }
}

//calcolo del grado sulla base del punteggio totale
function getGrado(punteggio){ 
    
    var localGrado=1;
    //punti del grado corrente
    var eccesso=0;  
    while(punteggio>0){
        eccesso=punteggio; 
        punteggio-=localGrado*15000; 
        if(punteggio>0)
            localGrado++;
    }
    
    grado={'gr': localGrado,'eccesso': eccesso};   
}

function setGrado(punteggio){
    grado.eccesso=parseInt(grado.eccesso)+punteggio;

    if(parseInt(grado.eccesso)>15000*(grado.gr)){
        grado.eccesso=parseInt(grado.eccesso)-15000*(grado.gr);
        grado.gr++;      
    }
    
    $("#grado").empty();
    $("#grado").text(grado.gr);
    
    $("#progress-bar").attr("aria-valuenow",""+grado.eccesso);
    $("#progress-bar").attr("aria-valuemax",""+15000*(grado.gr));
    $("#progress-bar").css("width",""+(grado.eccesso/(15000*grado.gr))*100+"%");
    
    $("#eccesso").empty();
    $("#eccesso").text(grado.eccesso);
}

// Dati pagina html(profile.html) impostati sulla base della sessione utente
if(userJSON.result!= "false"){
    $('#name').val(userJSON.result.name);
    $('#surname').val(userJSON.result.surname);
    $('#email').val(userJSON.result.email);
    $('#username').val(userJSON.result.username);
    $('#password').val(userJSON.result.password);
    $("#gioca").append("<li><a href='leaderboard.html'>Leaderboard</a></li>");
    $("#nav").append("<li id='profile'><a href='profile.html'> Profilo</a></li>");
    $("#nav").append("<li id='logout'><a href='PHP/logout.php'> Logout</a></li>");
    $("#nav").append("<li id='level'> <span class='glyphicon glyphicon-user'></span> "+userJSON.result.username+" Grado : <nobr id='grado'>"+ grado.gr+"</nobr><div class='progress'><div id='progress-bar' class='progress-bar' role='progressbar' aria-valuenow='"+grado.eccesso+"' aria-valuemin=0 aria-valuemax='"+15000*(grado.gr)+"' style='width:"+(grado.eccesso/(15000*(grado.gr)))*100+"%'><p id='eccesso'>"+grado.eccesso+"</p></div></div></li>");
    $("#login").remove();
    $("#sign").remove();
    $("#play").attr("href","game.html");
}
else{
    $("#play").attr("href","login.html?mex=must_log");
    $("#nav").append("<li id='login'><a href='login.html'>Login</a></li>");
    $("#nav").append("<li id='sign'><a href='registration.html'>Registrati</a></li>");
    $("#logout").remove();
    $("#profile").remove();
}

if (userJSON.result.livello > 9) {
     $("#gioca").append("<li id ='justplay'> <a href='justPlay.html'>Missile Command</a></li>");
}
    


             
