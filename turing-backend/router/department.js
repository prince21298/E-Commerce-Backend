module.exports=(department, knex)=>{
    department.get("/",(req,res)=>{
        knex.select("*")
        .table("department")
        .then((data)=>{
            res.send(data)
            console.log("data get sucessfully..  ");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })


    department.get("/:department_id",(req,res)=>{
        var department_id=req.params.department_id;
        knex.select("*")
        .table("department")
        .where("department_id",department_id)
        .then((data)=>{
            res.send(data)
            console.log("get_data_sucessfully..  ");	
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })
}
   

