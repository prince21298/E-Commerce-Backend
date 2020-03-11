module.exports=(attributes,knex)=>{
    attributes.get("/",(req,res)=>{
        knex.select("*")
        .table("attribute")
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
            
        })
    })

    attributes.get("/:id",(req,res)=>{
        var id=req.params.id;
        knex.select("*")
        .table("attribute")
        .where("attribute_id",id)
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
            
        })
    })

    attributes.get("/values/:id",(req,res)=>{
        var id=req.params.id;
        knex.select("attribute_value_id","value")
        .table('attribute')
        .join("attribute_value",{'attribute.attribute_id':'attribute_value.attribute_id'})
        .where("attribute_value.attribute_id",id)
        .then((data)=>{
            res.send(data)
            console.log('done');
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })

    attributes.get('/InProduct/:id',(req,res)=>{
        var id=req.params.id;
        knex.select('name as attribute_name','value as attribute_value','product_attribute.attribute_value_id')
        .table('attribute')
        .join('attribute_value',{'attribute.attribute_id':'attribute_value.attribute_id'})
        .join('product_attribute',{'attribute_value.attribute_value_id':'product_attribute.attribute_value_id'})
        .where('product_id',id)
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