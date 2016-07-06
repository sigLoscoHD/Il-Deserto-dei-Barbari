var user;

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

  $.ajax({
    url:"session.php",
    type:"get",
    dataType: 'text',
    async:false,
    success:function(data){
          user=data;
          console.log(data);
        }
    });

    console.log(user);
    var userJSON= JSON.parse(user);
    console.log(JSON.stringify(userJSON));
    if(user.result!= false){
        $('#name').val(userJSON.result.name);
        $('#surname').val(userJSON.result.surname);
        $('#email').val(userJSON.result.email);
        $('#username').val(userJSON.result.username);
        $('#password').val(userJSON.result.password);
    }
       

