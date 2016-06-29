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
    url:"JavaScript/missile_command.js",
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

//Modal: caricamento automatico del modal contenente le istruzioni
$(window).load(function(){
        $("#text").empty();
        $('#myModal').modal('show');
        $(".modal-title").empty();
        $(".modal-title").append("Orders");
        $("#text").append("<img src='images/generale.jpg'/>");
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
        $("#myModal").modal();
        $(".modal-title").empty();
        $(".modal-title").append("Orders");
        $("#text").append("<img src='images/generale.jpg'/>");
        $("#text").append(config.command);
       
    });
    
    $("#help1").click(function() {
        $("#text").empty();
        $("#myModal").modal();
        $(".modal-title").empty();
        $(".modal-title").append("Help me");
        $("#text").append("<img src='images/crazyprog.jpg'/>");
        $("#text").append(config.help);
       
    });  
    
$("#close, #esc").click(function() {
       $("#text").empty();
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
  var data= new FormData();
  data.append("data", doc.getValue());
  console.log(data);
  var xhr = (window.XMLHttpRequest) ? new XMLHttpRequest() : new activeXOject("Microsoft.XMLHTTP");
  xhr.open('post', 'saveFile.php', false);
  xhr.send(data);
});

function onNewLine(){
    editor.replaceSelection("");
}

