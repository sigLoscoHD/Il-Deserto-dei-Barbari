$.ajax({
    url:"checkLevel.php",
    type:"get",
    dataType: 'text',
    async:false,
    success:function(data){         
                for(var i=0;i<data;i++){
                    console.log(data);
                    console.log(i);
                    $("#"+(i+1)).removeAttr("disabled");
                }
            }
    });


