/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//riprende paraetri da un url
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var parametro=getUrlParameter("id"); // questo parametro ci indica a quale livello facciamo riferimento


//riprende il file config.json di configurazione dei livelli

var config;

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

// Initialize CodeMirror editor

var doc;
var editor;
var missile;

//riprendiamo il codice di missile_command
$.ajax({
    url:"JavaScript/test/reset"+parametro+".js",
    type:"get",
    async:false,
    success:function(data){
         missile=data;
    }
});

//creazione dell'editor di code mirror

editor = CodeMirror.fromTextArea(document.getElementById('code'),{
            mode: 'javascript',
            lineNumbers: true,
            firstLineNumber: 0,
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Enter": onNewLine
            }
        });  

//documento corrispondente all'editor
doc=editor.getDoc();
doc.setValue(missile);
doc.setCursor(config.editable.begin+10);

//appendiamo il titolo del livello sopra all'editor
$("#numlev").append(config.title);
//al caricamento della pagina andiamo a caricare il giusto js con il bug in base al livello
$(window).load(function (){
    $("#script").attr("src","JavaScript/test/reset"+parametro+".js");
});

//Modal: caricamento automatico del modal contenente le istruzioni
$(window).load(function(){
        $("#text").empty();
        $("#image").empty();
        $('#myModal').modal('show');
        $(".modal-title").empty();
        $(".modal-title").append("Orders");
        $("#image").append("<img src='images/generale.jpg'/>");
        $("#text").append(config.command);
});

var audio = new Audio('audio/ring.mp3');

$(window).load(function(){
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
  console.log(result);   
    if (result===true){        
        var data= new FormData();
        data.append("data", doc.getValue());
        data.append("param", parametro);
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXOject("Microsoft.XMLHTTP");
        xhr.open('post', 'saveFile.php', false);
        xhr.send(data);
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

var resetText;

$("#reset").click(function(){
     doc.undo();
});

function onNewLine(){
    editor.replaceSelection("");
}

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