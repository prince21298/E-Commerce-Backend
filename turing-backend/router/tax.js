module.exports=(tax,knex)=>{
    tax.get("/",(req,res)=>{
        knex('tax').select("*")
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
    tax.get("/:id",(req,res)=>{
        tax_id=req.params.id;
        knex('tax').select("*").where('tax_id',tax_idcler)
        .then((data)=>{
            res.send(data)
        })
        .catch((err)=>{
            res.send(err)
        })
    })
}