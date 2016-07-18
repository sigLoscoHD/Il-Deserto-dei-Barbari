function store_points(points){
    $.ajax({
        url:"PHP/increment_points.php?points="+points,
        type:"get",
        async:false,
        success:function(){}
    });
    
    setGrado(points);
}

