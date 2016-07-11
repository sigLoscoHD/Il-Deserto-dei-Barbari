var parametro=getUrlParameter("id"); // questo parametro ci indica a quale livello facciamo riferimento
var doc;
var editor;
var missile;
var config; //riprende il file config.json di configurazione dei livelli
var audio = new Audio('audio/ring.mp3');

//riprendiamo il file di configurazione fatto in json
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

//riprendiamo il codice di missile_command in base a quale livello ci troviamo
$.ajax({
    url:"JavaScript/test/reset"+parametro+".js",
    type:"get",
    async:false,
    success:function(data){
         missile=data;
    }
});

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

var failSound= new Audio("audio/fail.mp3");
var result;
$("#save").click(function(){
    
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
    if (result===true){        
        var data= new FormData();
        data.append("data", doc.getValue());
        data.append("param", parametro);
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXOject("Microsoft.XMLHTTP");
        xhr.open('post', 'saveFile.php', false);
        xhr.send(data);
        $.ajax({
            url:"incrementLevel.php?mex=get",
            type:"post",
            dataType: 'text',
            async:false,
            success:function(data){         
                       if(data==parametro){
                           $.ajax({
                                url:"incrementLevel.php?mex=update",
                                type:"post",
                                dataType: 'text',
                                async:false,
                                success:function(){}
                            });
                       }
                    }
        });
       window.location="levelSucc.html?id=" + parametro;  
    }
    else{
        failSound.play();
        $("#result").empty();
        $('#result').html("<div class='alert alert-danger fade in'><strong>Error!</strong>Try again!<span class='glyphicon glyphicon-ban-circle'></span></div>");
        setTimeout(function(){
               $(".alert").alert('close');
           },2000);
         
       }
});


function soluzione1(){
   var line1=doc.getLine(81);
   var line2=doc.getLine(82);
   var result1="'x': event.clientX - this.offsetLeft,";
   var result2="'y': event.clientY - this.offsetTop";
   
   if (line1.trim() === result1 && line2.trim() === result2)
       return true;
   else
       return false;
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