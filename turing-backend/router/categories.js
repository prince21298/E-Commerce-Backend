module.exports=(categories,knex)=>{
    categories.get("/",(req,res)=>{
        knex.select("*")
        .table("category")
        .then((data)=>{
            res.send(data)
            console.log("get data sucessfully..    ");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })
    
    
    categories.get("/:category_id",(req,res)=>{
        var category_id=req.params.category_id;
        knex.select("*")
        .table("category")
        .where("category_id",category_id)
        .then((data)=>{
            res.send(data)
            console.log("data get sucessfully...    ");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })


    categories.get("/inProduct/:id1",(req,res)=>{
        var id1=req.params.id1;
        knex.select("category.category_id","department_id","name")
        .from("category")
        .join('product_category','category.category_id','=','product_category.category_id')
        .where('product_category.product_id',id1)
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
            
        })
    })


    categories.get("/inDepartment/:id",(req,res)=>{
        var id=req.params.id;
        knex.select("*")
        .table("category")
        .where("department_id",id)
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })
}

