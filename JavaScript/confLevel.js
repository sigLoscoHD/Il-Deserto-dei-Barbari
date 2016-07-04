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


$("#save").click(function(){
    var result= soluzione1();
    if (result===true){
        var data= new FormData();
        data.append("data", doc.getValue());
        var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXOject("Microsoft.XMLHTTP");
        xhr.open('post', 'saveFile.php', false);
        xhr.send(data);
        window.location="levelSucc.html?id=1";
        alert("soluzione corretta!!");
        
    }
    else
        alert("soluzione sbagliata!!");
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
   console.log(line1);
   console.log(line2);
   console.log(result1);
   console.log(result2);
   if (line1.trim() === result1 && line2.trim() === result2){
       return true;
   }else
   {
       return false;
   }
   
}
