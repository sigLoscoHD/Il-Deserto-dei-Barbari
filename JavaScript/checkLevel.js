$.ajax({
    url:"PHP/checkLevel.php",
    type:"get",
    dataType: 'text',
    async:false,
    success:function(data){         
                for(var i=0;i<data;i++){
                    $("#"+(i+1)).removeAttr("disabled");
                }
            }
    });


