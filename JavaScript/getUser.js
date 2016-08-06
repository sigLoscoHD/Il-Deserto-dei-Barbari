var user;

function grado(punteggio){
    var gr=1;
    while(punteggio>0){
        eccesso=punteggio; 
        punteggio-=gr*15000; 
        if(punteggio>0)
            gr++;
    }
    return gr;
}

$.ajax({
url:"PHP/getUser.php",
type:"post",
dataType: 'text',
async:false,
success:function(data){
            user=JSON.parse(data);
        }
});

for(var i=0;i<Object.keys(user).length;i++){

    $('.table').append("<tr><td>"+(i+1)+"</td><td>"+Object.keys(user)[i]+"</td><td>"+grado(user[Object.keys(user)[i]])+"</td><td>"+user[Object.keys(user)[i]]+"</td></tr>");
}

