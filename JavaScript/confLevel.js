/* 
* In questo file configuriamo l'editor ed il gioco secondo il livello cliccato dall'utente.
*/


var parametro=getUrlParameter("id"); // questo parametro ci indica a quale livello facciamo riferimento
var check=getUrlParameter("check"); //parametro che determina se ho cliccato save and test o meno
var doc;
var editor;
var missile;
var config; //riprende il file config.json di configurazione dei livelli
var audio = new Audio('audio/ring.mp3');
var audioUnlock= new Audio("audio/unlock.mp3");
var failSound= new Audio("audio/fail.mp3");

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

if (check=="0"){
//riprendiamo il codice di missile_command in base a quale livello ci troviamo
$.ajax({
    url:"JavaScript/test/reset"+parametro+".js",
    type:"get",
    async:false,
    success:function(data){
         missile=data;
    }
});
}
else {
    $.ajax({
    url:"JavaScript/test/test.js",
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

$("#numlev").append(config.title); //appendiamo il titolo del livello sopra all'editor



if( check == "0"){
//al caricamento della pagina....
$(window).load(function(){
        
        //settiamo il giusto script
        $("#script").attr("src","JavaScript/test/reset"+parametro+".js"); 
        
        //Configurazione del modal
        $("#text").empty();
        $("#image").empty();
        $('#myModal').modal('show');
        $(".modal-title").empty();
        $(".modal-title").append("Orders");
        $("#image").append("<img src='images/generale.jpg'/>");
        $("#text").append(config.command);

        setTimeout(function(){
           $("#help1").removeClass("disabled");
           $("#help1").css("color","red");
           audio.play();
           $('#mex').html("<div class='alert alert-info fade in'><strong>Info!</strong> Help avaiable! <span class='glyphicon glyphicon-arrow-up'></span></div>");
           setTimeout(function(){
               $(".alert").alert('close');
           },3000);
        },10000);
            
});
} else{
    $("#script").attr("src","JavaScript/test/test.js"); 
}


 $("#orders").click(function() {
        $("#text").empty();
        $("#image").empty();
        $("#myModal").modal();
        $(".modal-title").empty();
        $(".modal-title").append("Orders");
        $("#image").append("<img src='images/generale.jpg'/>");
        $("#text").append(config.command);
       
});
    
$("#help1").click(function() {
        $("#text").empty();
        $("#image").empty();
        $("#myModal").modal();
        $(".modal-title").empty();
        $(".modal-title").append("Help me");
        $("#image").append("<img src='images/crazyprog.jpg'/>");
        $("#text").append(config.help);
       
});  
    
$("#undo").click(function(){
     doc.undo();
});   

//linee non editabili sulla base del livello
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
 * al click del pulsante "Save and Test" reindirizziamo alla pagina con il parametro "check" settato a 1
 * e andiamo a modificare lo script sia nell'editor che quello appeso al gioco ( settiamo test.js come 
 * nuovo script, ovvero lo script modificato dall'utente) 
 */
$("#save").click(function(){     
        var data= new FormData();
        data.append("data", doc.getValue());
        data.append("param", parametro);
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXOject("Microsoft.XMLHTTP");
        xhr.open('post', '../PHP/saveFile.php', false);
        xhr.send(data);
        window.location="level.html?id=" + parametro + "&check=1"; 
});
/*
 * se siamo stati reindirizzati alla pagina con il parametro "check=1" 
 * significa che abbiamo modificato il codice all'interno del nostro editor e
 * abbiamo premuto save and test (oppure abbiamo solamente cliccato save and test 
 * senza modificare nulla) 
 */
if (check == "1"){
    //in base al livello in cui ci troviamo applichiamo una soluzione...
   switch (parametro) {
        case "1":
            result= soluzione1();
            break; 
        case "2":
            result= soluzione2();
            break; 
        case "3":
            result= soluzione3();
            break; 
    } 
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
                       if(data==parametro){
                           $.ajax({
                                url:"PHP/incrementLevel.php?mex=update",
                                type:"post",
                                dataType: 'text',
                                async:false,
                                success:function(){}
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
        $(".modal-title").append(config.succTitle);
        $("#image").append("<img src='images/generale.jpg'/>");
        $("#text").append(config.succCommand);
        
        //rimuoviamo certe voci dalla navbar in modo tale da costringere l'utente al gioco
        $("#brand").attr("href", "#");
        $("#playNav").remove();
        $("#profile").remove();
        $("#aboutUs").remove();
        $("#orders").remove();
        $("#help").remove();
        
        //rimuoviamo i pulsanti "Save and Test e "Undo"
        $("#save").remove();
        $("#undo").remove();
     
        //a livello completato sblocchiamo l'obiettivo dopo pochi secondi
        setTimeout(function(){
            audioUnlock.play();
            $('#trophy').html("<div class='alert alert-success fade in'><strong>Unlocked Trophy!</strong> Level "+ parametro + " complete! <span class='glyphicon glyphicon-ok'></span></div>");
            setTimeout(function(){
                   $(".alert").alert('close');
                   //nel caso in cui si è completato un gruppo di livelli ulteriore sblocco
                   if (parametro== "3"){
                        $('#trophy').empty();
                        setTimeout(function(){
                            audioUnlock.play();
                            $('#trophy').html("<div class='alert alert-success fade in'><strong>Unlocked Trophy!</strong> Debugging King!<span class='glyphicon glyphicon-ok'></span></div>");
                            setTimeout(function(){
                              $(".alert").alert('close');
                            },6000);
                        },2000);

                    }
            },6000);
            //appendiamo il nuovo pulsante "Next"
            $('#codice').append("<button type='button' class='btn btn-danger btn-lg' id='next'>Next <span class='glyphicon glyphicon-arrow-right'></span></button>");
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
        $('#result').html("<div class='alert alert-danger fade in'><strong>Error!</strong>Try again!<span class='glyphicon glyphicon-ban-circle'></span></div>");
        setTimeout(function(){
               $(".alert").alert('close');
           },2000);
    }
}

function soluzione1(){
    var x= MC.getErrX();
    var y= MC.getErrY();
    
    console.log(" ciiosoas" + y);
  if (x>=0 && x<=5 && y>=0 && y<=5 ){
      return true;
  }
  else{ 
      return false;
  }
}



function soluzione2(){
    var line= doc.getLine(418);
    var exp = /\d+/g; //espressione regolare che ci permette di cercare un numero all'interno di una stringa
    var result=line.match(exp);
    console.log(result);
    if (result >= 40 && result < 100 ){
        return true;
    }
    else{
        return false;
    }
}

function soluzione3(){
    var line= doc.getLine(207);
    var exp = /\d+/g; //espressione regolare che ci permette di cercare un numero all'interno di una stringa
    var result=line.match(exp);
    console.log(result[0]);
    if (result[0]=== "0")
        return true;
    else
        return false;
    
}