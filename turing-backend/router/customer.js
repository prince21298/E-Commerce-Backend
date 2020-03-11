module.exports=(customer,knex,jwt)=>{
    customer.post("/customers",(req,res)=>{
        knex('customer').insert({
            "name":req.body.name,
            "email":req.body.email,
            "address_1":req.body.address_1,
            "mob_phone":req.body.mob_phone,
            "password":req.body.password
        })
        .then((data)=>{
            res.send(data)
            console.log("your data inserted sucessfully");
        })
        .catch((err)=>{
            res.send(err)
            console.log("data not inserted");
        })
    })

    customer.post('/customers/login',(req,res)=>{
        var email=req.body.email
        var password=req.body.password
        knex.select('customer_id').from( "customer" ).where ({"email" : email , "password" : password})
        .then((data)=>{
            if (data.length==0){
                console.log("wrong emial or password");
                res.send("wrong email or password")
            }
            else{
                data=JSON.parse(JSON.stringify(data))
                var token = jwt.sign(data[0],'prince',{ expiresIn : "24h"})
                res.cookie(token)
                    if(token.length!=0){
                        res.send('login sucessfully')
                        console.log('login sucessfully');
                    }
                    else{
                        res.send('err')
                        console.log('err');
                    }
            }
        }).catch((err)=>{
            res.send("you Don't have id on this site")
            console.log(err);
        })
    })

    customer.get("/customer",(req,res)=>{
        var cookie=req.headers.cookie.slice(0,-10)
        var dat=jwt.verify(cookie,'prince')  
        knex.select('*').from( "customer" ).where ({"customer_id" : dat.customer_id})
        .then((data)=>{
            res.send(data)
            console.log('data get sucessfully');
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })
    customer.put('/customer',(req,res)=>{
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{                     
            if(!err){
                knex.update({
                    "password":req.body.password,
                    "email":req.body.email,
                    "name":req.body.name,
                    "credit_card":req.body.credit_card,
                    "address_1":req.body.address_1,
                    "address_2":req.body.address_2,
                    "city":req.body.city,
                    "region":req.body.region,
                    "postal_code":req.body.postal_code,
                    "country":req.body.country,
                    "shipping_region_id":req.body.shipping_region_id,
                    "day_phone":req.body.day_phone,
                    "eve_phone":req.body.eve_phone,
                    "mob_phone":req.body.mob_phone
                }).from( "customer" ).where ({"customer_id" : data.customer_id})
                .then(()=>{
                    res.send('updated')
                    console.log('updated');
                }).catch((err)=>{
                    res.send(err)
                    console.log(err.message);
                })
            }
        else{
        res.send(err.message)
        }
        })
    })
    customer.put('/customers/address',(req,res)=>{
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{                     
            if(!err){
                knex.update({
                    "address_1":req.body.address_1,
                    "address_2":req.body.address_2
                }).from( "customer" ).where ({"customer_id" : data.customer_id})
                .then(()=>{
                    res.send('updated')
                    console.log('updated');
                }).catch((err)=>{
                    res.send(err)
                    console.log(err.message);
                })
            }
        else{
        res.send(err.message)
        }
        })
    })
    customer.put('/customers/creditcard',(req,res)=>{
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{                     
            if(!err){
                knex.update({
                    "credit_card":req.body.credit_card
                }).from( "customer" ).where ({"customer_id" : data.customer_id})
                .then(()=>{
                    res.send('updated')
                    console.log('updated');
                }).catch((err)=>{
                    res.send(err)
                    console.log(err.message);
                })
            }
        else{
        res.send(err.message)
        }
        })
    })
}