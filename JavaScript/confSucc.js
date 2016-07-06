var parametro;
var doc;
var editor;
var text;
var config;
var audioUnlock= new Audio("audio/unlock.mp3");

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

parametro=getUrlParameter("id");


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

//riprendiamo il codice di missile_command corretto dai bug
$.ajax({
    url:"JavaScript/test/test.js",
    type:"get",
    async:false,
    success:function(data){
         text=data;
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
doc.setValue(text);
//tutte le righe bloccate e non editabili
for(var i=0; i<doc.lineCount();i++){
      doc.addLineClass(i,"background","readOnly");
}
//blocco tasto enter
function onNewLine(){
    editor.replaceSelection("");
}

//appendiamo il titolo del livello sopra all'editor
$("#numlev").append(config.title);

// lo facciamo giocare per 30 secondi oppure controlla che il gioco funzioni correttamente 
$(window).load(function(){
    $("#text").empty();
    $("#image").empty();
    $('#myModal').modal('show');
    $(".modal-title").empty();
    $(".modal-title").append(config.succTitle);
    $("#image").append("<img src='images/generale.jpg'/>");
    $("#text").append(config.succCommand);
    setTimeout(function(){
        audioUnlock.play();
        $('#trophy').html("<div class='alert alert-success fade in'><strong>Unlocked Trophy!</strong> Level "+ parametro + " complete! <span class='glyphicon glyphicon-ok'></span></div>");
        setTimeout(function(){
               $(".alert").alert('close');
               if (parametro== 3){
                    $('#trophy').empty();
                    setTimeout(function(){
                        audioUnlock.play();
                        $('#trophy').html("<div class='alert alert-success fade in'><strong>Unlocked Trophy!</strong> Debugging King!<span class='glyphicon glyphicon-ok'></span></div>");
                        setTimeout(function(){
                          $(".alert").alert('close');
                        },6000);
                    },3000);
                    
                }
        },6000);
        $("#next").click(function() {
        window.location="game.html?lev=1";
    }); 
    },7000);
    
});
