module.exports=(products,knex,jwt)=>{
    products.get('/',(req,res)=>{
        knex.select('*')
        .table('product')
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })

    products.get('/search',(req,res)=>{
        knex.select('product_id','name','description','price','discounted_price','thumbnail')
        .table('product')
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })

    products.get('/:id',(req,res)=>{
        var id=req.params.id;
        knex.select('*')
        .table('product')
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

    products.get('/inCategory/:id',(req,res)=>{
        var id =req.params.id;
        knex.select('product.product_id','name','description','price','discounted_price','thumbnail')
        .table('product')
        .join('product_category',{'product.product_id':'product_category.product_id'})
        .where('category_id',id)
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })

    products.get('/inDepartment/:id',(req,res)=>{
        var id = req.params.id;
        knex.select('product.product_id','product.name','product.description','price','discounted_price','thumbnail')
        .table('product')
        .join('product_category',{'product.product_id':'product_category.product_id'})
        .join('category',{'product_category.category_id':'category.category_id'})
        .where('department_id',id)
        .then((data)=>{
            res.send(data)
            console.log("done");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })

    products.get('/:id/details',(req,res)=>{
        var id=req.params.id;
        knex.select('product_id','name','description','price','discounted_price','image','image_2 as image2')
        .table('product')
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

    products.get('/:id/locations',(req,res)=>{
        var id = req.params.id;
        knex.select('category.category_id','category.name as category_name','department.department_id','department.name as department_name')
        .table('product_category')
        .join('category',{'product_category.category_id':'category.category_id'})
        .join('department',{'category.department_id':'department.department_id'})
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

    products.post ('/:id/reviews',(req,res)=>{
        var id=req.params.id;
        var cookie=req.headers.cookie.slice(0,-10)
        var dat=jwt.verify(cookie,'prince')
        knex("review").insert({
            "product_id":id,
            "review":req.body.review,  
            "rating":req.body.rating,
            "customer_id":dat.customer_id,
            "created_on":new Date()
        })
        .then((data)=>{
            res.send("data inserted sucessfully")
            console.log("data inserted sucessfully");
        })
        .catch((err)=>{
            res.send(err)
            console.log("data not inserted");
        })
    })

    products.get('/:id/reviews',(req,res)=>{
        var id=req.params.id
        knex.select('name','review','rating','created_on')
        .table('review')
        .join('product',{'review.product_id':'product.product_id'})
        .where("product_id",id)
        .then((data)=>{
            res.send(data)
            console.log("data get sucessfully");
        })
        .catch((err)=>{
            res.send(err)
            console.log(err);
        })
    })
} 