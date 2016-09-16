/* 
* In questo file configuriamo l'editor ed il gioco a seconda del livello a cui si trova l'utente.
*/
$.ajaxSetup({
    cache: false
});

var parametro=getUrlParameter("id"); // questo parametro ci indica a quale livello facciamo riferimento
var check=getUrlParameter("check"); //parametro che determina se ho cliccato save and test o meno
var doc;
var editor;
var missile=""; //variabile con il codice del gioco da visualizzare sull'editor.
var config; //riprende il file config.json di configurazione dei livelli
var audio = new Audio('audio/ring.mp3');
var audioUnlock= new Audio("audio/unlock.mp3");
var failSound= new Audio("audio/fail.mp3");


if(parseInt(parametro)>parseInt(userJSON.result.livello))
    window.location.href = 'level.html?id='+userJSON.result.livello+'&check=init';

//riprendiamo il file di configurazione fatto in json in base al livello (parametro)
$.ajax({
    url:"JavaScript/config.json",
    type:"get",
    async:false,
    success:function(data){
        for(var i=0; i< data.levels.length; i++ ){
            if(parametro === data.levels[i].id){
                config=data.levels[i];               
            }
        }
    }
}); 

/*
 * Se check è uguale a zero non abbiamo ancora fatto save and test (caricheremo reset .js sull'editor).
 * Altrimenti abbiamo già cercato di testare una soluzione e quindi caricheremo personale js sull'editor .
 */
if (check=="init"||check=="crit"){
    //riprendiamo il codice di missile_command in base a quale livello ci troviamo
    $.ajax({
        url:"JavaScript/test/reset"+parametro+".js",
        type:"get",
        async:false,
        success:function(data){
             missile=data;
        }
    });

    if(check=="crit"){
        failSound.play();
        $('#result').html("<div class='alert alert-danger fade in'><strong>Errore critico! La tua soluzione è semanticamente sbagliata e porta ad un malfunzionamento del gioco. Prova ancora!</strong><span class='glyphicon glyphicon-ban-circle'></span></div>");
        setTimeout(function(){
            $(".alert").alert('close');
        },10000);
    }
}
else {
    $.ajax({
        url:"JavaScript/test/"+userJSON.result.id+".js",
        type:"get",
        async:false,
        success:function(data){
             missile=data;
        }
    });
}

//creazione dell'editor 
editor = CodeMirror.fromTextArea(document.getElementById('code'),{
            mode: 'javascript',
            lineNumbers: true,
            firstLineNumber: 0,
            gutters: ["CodeMirror-lint-markers"],
            lint: true,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Enter": onNewLine
            }
        });  

// funzione che rimpiazza l'enter con lo stringa vuota        
function onNewLine(){
    editor.replaceSelection("");
}        
        
doc=editor.getDoc(); //documento corrispondente all'editor
doc.setValue(missile); //settiamo il valore del codice da visualizzare sull'editor
doc.setCursor(config.editable.begin+10); // settiamo il cursore sulla parte di codice interessata al livello
editor.setSize(700, 400);
$("#numlev").append(config.title); //appendiamo il titolo del livello sopra all'editor


/*
 * In base al check come prima settiamo il codice di esecuzione del gioco e il modal 
 */
if( check == "init"){
    //al caricamento della pagina....
    $(window).load(function(){
            //settiamo il giusto script
            $("#script").attr("src","JavaScript/test/reset"+parametro+".js"); 

            //Configurazione del modal
            $("#text").empty();
            $("#image").empty();
            $("#modal-button").empty();
            $(".modal-title").empty();
            $('#myModal').modal('show');
            $(".modal-title").append("Tenente Rogers");
            $("#modal-button").text("Specifiche");  
            $("#image").append("<img src='images/generale.jpg'/>");
            $("#text").append(config.command);
            //secondo modal
            $("#specific").empty();
            $("#specific").append(config.specific);
            
            setTimeout(function(){
               $("#help1").removeClass("disabled");
               $("#help1").css("color","red");
               audio.play();
               $('#mex').html("<div class='alert alert-info fade in'><strong>Info!</strong> Aiuto disponibile! <span class='glyphicon glyphicon-arrow-up'></span></div>");
               setTimeout(function(){
                   $(".alert").alert('close');
               },3000);
            },40000);

    });
}
else{
   $("#help1").removeClass("disabled");
   $("#help1").css("color","red"); 
}

/*
 * Ricapitolando:
 * se siamo stati reindirizzati alla pagina con il parametro "check=test" 
 * significa che abbiamo modificato il codice all'interno del nostro editor e
 * abbiamo premuto save and test (oppure abbiamo solamente cliccato save and test 
 * senza modificare nulla) 
 */


if (check == "test"){
    $("#script").attr("src","JavaScript/test/"+userJSON.result.id+".js?"+Math.random()); 
    //in base al livello in cui ci troviamo applichiamo una soluzione...
    switch (parametro) {
        case "1":
            result= soluzione1();
            checkResult(result);
            break; 
        case "2":
            result= soluzione2();
            checkResult(result);
            break; 
        case "3":
            result= soluzione3();
            checkResult(result);
            break;
        case "4":
            mustPlay();
            break;
        case "5":
            mustPlay();
            break;
        case "6":
            mustPlay();
            break;
        case "7":
            mustPlay();
            break;
        case "8":
            mustPlay();
            break;
        case "9":
            mustPlay();
            break;
    } 
    
}
function mustPlay(){
        $("#text").empty();
        $("#image").empty();
        $("#myModal").modal();
        $(".modal-title").empty();
        $("#modal-button").removeAttr("data-target");
        $("#modal-button").removeAttr("data-toogle");
        $("modal-button").removeClass("btn-danger");
        $(".modal-title").append("Tenente Rogers");
        $("#image").append("<img src='images/generale.jpg'/>");
        $("#text").append("<strong>Ora difendici!</strong> Testa la soluzione!");
        $("#modal-button").addClass("btn-default");
        $("#modal-button").text("Close");

}

$("#orders").click(function() {
        $("#text").empty();
        $("#image").empty();
        $("#modal-button").empty();
        $(".modal-title").empty();
        $("#myModal").modal();
        $(".modal-title").append("Tenente Rogers");
        $("#modal-button").attr("data-target", "#myModal2");
        $("#modal-button").attr("data-toogle", "modal");
        $("#modal-button").addClass("btn-danger");
        $("#modal-button").text("Specifiche");
        $("#image").append("<img src='images/generale.jpg'/>");
        $("#text").append(config.command);
        //secondo modal contenente le specifiche
        $("#specific").empty();
        $("#specific").append(config.specific);
       
});
    
$("#help1").click(function() {
        $("#text").empty();
        $("#image").empty();
        $("#modal-button").empty();
        $(".modal-title").empty();
        $("#myModal").modal();
        $("#modal-button").removeAttr("data-target");
        $("#modal-button").removeAttr("data-toogle");
        $("modal-button").removeClass("btn-danger"); 
        $(".modal-title").append("Scienziato Claiton");
        $("#modal-button").addClass("btn-default");
        $("#modal-button").text("Close");
        $("#image").append("<img src='images/crazyprog.jpg'/>");
        $("#text").append(config.help);
       
});  
    
$("#undo").click(function(){
     doc.undo();
});   

//setting delle linee non editabili sulla base del livello
var readOnly=new Array();

for(var i=0; i<doc.lineCount();i++){
    if(i<config.editable.begin || i>config.editable.end){
        readOnly[i]=i;
        doc.addLineClass(i,"background","readOnly");
    }
}

editor.on('beforeChange',function(cm,change){
    if(~readOnly.indexOf(change.from.line)){
        change.cancel();
    }
});


/*
 * Gestione della soluzione
 */
var result; // variabile all'interno della quale andiamo a salvare il valore della soluzione (in genere un bool)

/*
 * al click del pulsante "Save and Test" reindirizziamo alla pagina con il parametro "check" settato a test
 * e andiamo a eseguire saveFile.php che scrive/sovrascrive il file personale js.
 */
$("#save").click(function(){
    // se vengono riscontrati degli errori di sintassi nell'editor, stampiamo l'errore e rimaniamo sulla pagina
    if ($(".CodeMirror-lint-mark-error").length > 0 || $(".CodeMirror-lint-marker-multiple").length >0){
        failSound.play();
        $("#result").empty();
        $('#result').html("<div class='alert alert-danger fade in'><strong>Errore sintattico!</strong>Prova ancora!<span class='glyphicon glyphicon-ban-circle'></span></div>");
        setTimeout(function(){
               $(".alert").alert('close');
           },2000);
    }
    else{
        // in caso contrario andiamo avanti
        var data= new FormData();
        data.append("data", doc.getValue());
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXOject("Microsoft.XMLHTTP");
        xhr.open('post', 'PHP/saveFile.php', false);
        xhr.send(data);
        window.location="level.html?id=" + parametro + "&check=test"; 
        }
});




function checkResult(result){
        if (result == true){
            /*
             * in caso di successo....
             */

            //incrementiamo il numero di livelli sbloccati dal nostro utente
            $.ajax({
                url:"PHP/incrementLevel.php?mex=get",
                type:"post",
                dataType: 'text',
                async:false,
                success:function(data){   
                            if(data.trim()==parametro.trim()){ //puliamo le variabili da spaziature
                                $.ajax({
                                    url:"PHP/incrementLevel.php?mex=update",
                                    type:"post",
                                    dataType: 'text',
                                    async:false,
                                    success:function(){}
                                });

                                $.ajax({
                                    url:"PHP/increment_points.php?points=10000",
                                    type:"post",
                                    async:false,
                                    success:function(){setGrado(10000);}
                                });                        
                            }
                        }
            });       
            //rendo tutte le righe non editabili (l'editor possiamo anche rimuoverlo --> scelta da prendere al momento lascio così)
            for(var i=0; i<doc.lineCount();i++){
                doc.addLineClass(i,"background","readOnly");
            }

            /*
             * all'interno del nostro modal andiamo ad appendere la frase di conclusione 
             * del livello del capitano
             */
            $("#text").empty();
            $("#image").empty();
            $('#myModal').modal('show');
            $(".modal-title").empty();
            $("#modal-button").empty();
            $("#modal-button").removeAttr("data-target");
            $("#modal-button").removeAttr("data-toogle");
            $("modal-button").removeClass("btn-danger");
            $("#modal-button").addClass("btn-default");
            $("#modal-button").text("Close");
            $(".modal-title").append(config.succTitle);
            $("#image").append("<img src='images/generale.jpg'/>");
            $("#text").append(config.succCommand);
            $("#orders").remove();
            $("#help").remove();

            //rimuoviamo i pulsanti "Save and Test e "Undo"
            $("#save").remove();
            $("#undo").remove();

            //a livello completato sblocchiamo l'obiettivo dopo pochi secondi
            setTimeout(function(){

                if(userJSON.result.livello == parametro){
                    audioUnlock.play();
                    $('#trophy').html("<div class='alert alert-success fade in'><strong> <span class='glyphicon glyphicon-tower'></span> Trofeo sbloccato!</strong> livello "+ parametro + " completato! <span class='glyphicon glyphicon-ok'></span></div>");
                    $('#points').html("<div class='alert alert-warning fade in'><strong> <span class='glyphicon glyphicon-fire'></span> + 10.000 Points </strong> Livello "+ parametro + " completato! <span class='glyphicon glyphicon-ok'></span></div>");
                }
                else{
                    $('#trophy').html("<div class='alert alert-success fade in'> Livello "+ parametro + " completato! <span class='glyphicon glyphicon-ok'></span></div>");
                }

                setTimeout(function(){
                       $(".alert").alert('close');
                       //nel caso in cui si è completato un gruppo di livelli ulteriore sblocco

                       //trofeo complete debug
                       if (parametro== "3" && userJSON.result.livello == parametro){
                            $('#trophy').empty();
                            setTimeout(function(){
                                audioUnlock.play();
                                $('#trophy').html("<div class='alert alert-success fade in'><strong> <span class='glyphicon glyphicon-tower'></span> Trofeo sbloccato!</strong> Debugging King!<span class='glyphicon glyphicon-ok'></span></div>");
                                setTimeout(function(){
                                  $(".alert").alert('close');
                                },6000);
                            },2000);

                        }

                        // trofeo complete refactor
                        if (parametro== "6" && userJSON.result.livello == parametro){
                            $('#trophy').empty();
                            setTimeout(function(){
                                audioUnlock.play();
                                $('#trophy').html("<div class='alert alert-success fade in'><strong> <span class='glyphicon glyphicon-tower'></span> Trofeo sbloccato!</strong> Refactor King!<span class='glyphicon glyphicon-ok'></span></div>");
                                setTimeout(function(){
                                  $(".alert").alert('close');
                                },6000);
                            },2000);

                        }

                        // trofeo complete design 
                        if (parametro== "9" && userJSON.result.livello == parametro){
                            $('#trophy').empty();
                            setTimeout(function(){
                                audioUnlock.play();
                                $('#trophy').html("<div class='alert alert-success fade in'><strong> <span class='glyphicon glyphicon-tower'></span> Trofeo sbloccato!</strong> Design King!<span class='glyphicon glyphicon-ok'></span></div>");
                                $('#gift').html("<div class='alert alert-success fade in'><strong> <span class='glyphicon glyphicon-gift'></span> Gioco Missile Command sbloccato <span class='glyphicon glyphicon-ok'></span></div>");
                                setTimeout(function(){
                                  $(".alert").alert('close');
                                },6000);
                            },2000);

                        }
                },6000);
                //appendiamo il nuovo pulsante "Next" che reindirizza a game.html
                $('#codice').append("<button type='button' class='btn btn-danger btn-lg' id='next'>Prossimo! <span class='glyphicon glyphicon-arrow-right'></span></button>");
                $("#next").click(function() {
                window.location="game.html";
            }); 
            },3000);

        }
        else {
            /*
             * in caso di errore..
             */
            failSound.play();
            $("#result").empty();
            $('#result').html("<div class='alert alert-danger fade in'><strong>Errore!</strong>Prova ancora!<span class='glyphicon glyphicon-ban-circle'></span></div>");
            setTimeout(function(){
                   $(".alert").alert('close');
               },2000);
        }
    }
    
    
function soluzione1(){
    var x= MC.getErrX();
    var y= MC.getErrY();
  if (x>=0 && x<=5 && y>=0 && y<=5 ){
      return true;
  }
  else{ 
      return false;
  }
}

function soluzione2(){
    var result="if(this.pos.y<this.target.y){"; //la soluzione
    var line=doc.getLine(601); // andiamo a prendere la riga incriminata
    line = line.replace(/\s+/g, '');
    if (result == line)
        return true;
    else 
        return false;
}

function soluzione3(){
    var line= doc.getLine(288);
    var exp = /\d+/g; //espressione regolare che ci permette di cercare un numero all'interno di una stringa
    var result=line.match(exp);
    if (result[0]=== "0")
        return true;
    else
        return false;   
}


function soluzione4(x,pot){
    var content;
    var check;
    for(var i=281; i<289; i++){
        content+= doc.getLine(i);
    }
    content=content.replace(/\s+/g, '');
    check= content.search("Math.pow");
    if (Math.pow(x,2) == pot && check == -1)
        result= true;
    else 
        result= false;
    checkResult(result);
}

var count=0;

function soluzione5(exp, cradius, initexp, initcrad, expSpeed, fradius,i){
    if(initexp){
        initcrad += expSpeed;
        if (cradius >= fradius) {
            initexp = false;           
        }
    }
    else
        initcrad -= expSpeed;

    if(i<100){
        if(initexp == exp && cradius === initcrad)
            count++; 
    }

    if(i==99){
        // andiamo a verificare la presenza dello switch nel codice
        var content;
        var check;
        for(var i=608; i<618; i++){
            content+= doc.getLine(i);
        }
        content=content.replace(/\s+/g, '');
        check= content.search("switch");
        if (count==100 && check == -1)
            result= true;
        else
            result= false;
        checkResult(result);
    }
 
}

function soluzione6(initEnt, ent, res){
    for (var i = 0; i < initEnt.length; i++) {
        initEnt[i].move();
   
    }
    var content;
    var check;
    for(var i=184; i<198; i++){
        content+= doc.getLine(i);
    }
    content=content.replace(/\s+/g, '');
    check= content.search("moveEntities");
    var strInitEnt= initEnt.toString();
    var strEnt=ent.toString();
    if(strInitEnt == strEnt && ent[0].distance<-10 && check != -1 && res == initEnt[1].ind && res == initEnt.length)
        result= true;
    else
        result=false;
    
    checkResult(result);
    
}

var control;

function soluzione7(missile,distance,hitShield,width){
    var Xshield = width/2;
    var Yshield = 420;
    var radiusShield = 248;
    var x = Xshield - missile.x,
        y = Yshield - missile.y;

    var dist = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                
    if (dist < radiusShield){ 
        control = true; 
    }   
    else{
        control = false;
    }
 
    if( (control==hitShield) && (distance==dist) ){
        result= true;
    }else{
        result= false;
    }
    
    checkResult(result);
}

function soluzione8(turret, width){
  if(   (   turret[1].width == 8 &&
            turret[1].height == 34 &&    
            turret[1].pos.x == (width / 2) + 110 - (turret[1].width / 2) &&
            turret[1].pos.y ==420 &&
            turret[1].pos.removed==0 &&
            turret[1].colour == 'rgb(255, 0, 0)'
        ) 
        &&
        (   turret[0].width == 6 &&
            turret[0].height == 24 &&    
            turret[0].pos.x == (width / 2) - (turret[0].width / 2) &&
            turret[0].pos.y ==420 &&
            turret[0].pos.removed==0 &&
            turret[0].colour == 'rgb(255, 0, 0)'
        )
    )
        result = true;
    else 
        result= false;

    checkResult(result);
}


function soluzione9(rocket, target, x, y){
    console.log( JSON.stringify(rocket));
    console.log(JSON.stringify(target));
    console.log("rocket x"+  rocket[0].x);
    console.log("rocket y"+  rocket[0].y);
    console.log("x"+  x);
    console.log("y"+  y);
    console.log("target" + rocket[0].target.toString()== target.toString());
    console.log("x" + rocket[0].x==x);
    console.log( "y" + rocket[0].y == y);
    if( rocket[0].target.x== target.x && rocket[0].target.y== target.y  && rocket[0].pos.x == x && rocket[0].pos.y == y )
        result= true;
    else 
        result= false;

    checkResult(result);
}