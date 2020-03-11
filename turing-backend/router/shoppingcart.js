module.exports=(shoppingcart,knex,jwt)=>{
    shoppingcart.post('/add',(req,res)=>{
        var name=req.body.name; 
        var attributes=req.body.attributes
        var cookie=req.headers.cookie.slice(0,-10)
        var cart_id=jwt.verify(cookie,'prince').customer_id
        knex.select('product_id').from('product').where({'name':name})
        .then((data1)=>{
            var a3=JSON.parse(JSON.stringify(data1))                  
            knex("shopping_cart").select('*').where({'cart_id':cart_id,'product_id':a3[0].product_id,"attributes":attributes})
            .then((data)=>{
                var a1=JSON.parse(JSON.stringify(data))
                if (data.length>0){
                    let a=a1[0].quantity+1
                    knex('shopping_cart').update('quantity',a).where("item_id",a1[0].item_id)
                    .then((data)=>{
                        res.send("product_added_successfuly")
                    })
                }
                else{
                    knex('shopping_cart')
                    .insert({
                    "cart_id":cart_id,
                    "product_id":a3[0].product_id,
                    "attributes":attributes,
                    "quantity":req.body.quantity,
                    'added_on':new Date
                    })
                    .then((data)=>{
                    res.send("data inserted sucessfully")
                    console.log("data inserted sucessfully");
                    })
                    .catch((err)=>{
                        res.send(err)
                        console.log("data not inserted");
                    })
                }
            })
        })
    })
    shoppingcart.get('/:cart_id',(req,res)=>{
        var id =req.params.cart_id;
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{
            if(id==data.customer_id){
                knex.select('item_id','name','attributes','product.product_id','price','quantity')
                .table('shopping_cart')
                .join('product',{'shopping_cart.product_id':'product.product_id'})
                .where('cart_id',data.customer_id)
                .then((data)=>{
                    for (i of data){i.subprice=i.quantity*i.price}
                    res.send(data)
                    console.log('data get sucessfully');
                })
                .catch((err)=>{
                    res.send(err)
                    console.log(err);
                })
            }else{
                res.send('this cart_id is not valid')
            }
        })
    })
    shoppingcart.put('/update/:item_id',(req,res)=>{
        var id =req.params.item_id;
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{
            knex('shopping_cart').update({
                "quantity":req.body.quantity
            }).where({"item_id":id,'cart_id':data.customer_id})
            .then((data)=>{
                if (data==0){
                    res.send('you can not change others data')
                }
                else{
                    res.send('quantity update Sucessfully')
                    console.log('quantity update Sucessfully');
                }
            })
        })
    })
    
    shoppingcart.delete('/empty/:cart_id',(req,res)=>{
        var id= req.params.cart_id;
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{
            if(id==data.customer_id){
                knex('shopping_cart').delete('*').where('cart_id',data.customer_id)
                .then((data)=>{
                    res.send('Deleted sucessfully')
                })
                .catch((err)=>{
                    res.send(err)
                })
            }else{
                res.send('you can not delete others detail')
            }
        })
    })

    shoppingcart.get('/save_for_later/:item_id',(req,res)=>{
        knex.schema.hasTable('save_for_later')
        .then((exist)=>{
            if(!exist){
                knex.schema.createTable('save_for_later', (table) => {
                table.integer('item_id');
                table.integer('cart_id');
                table.integer('product_id');
                table.varchar('attributes'),1000;
                table.integer('quantity',11);
                table.integer('buy_now');
                table.datetime('added_on')
                })
                .then((data)=>{
                    res.send('table was not exist now its exist in you datbase now you can use please send it again....')
                })
            }
            else{
                var id =req.params.item_id;
                var cookie=req.headers.cookie.slice(0,-10)
                jwt.verify(cookie,'prince',(err,data)=>{                    
                    knex('save_for_later').select('*').where({"cart_id":data.customer_id,'item_id':id})
                    .then((data)=>{
                        if(data.length!=0){
                            knex("save_for_later").select('*').where({'cart_id':data[0].cart_id,'product_id':data[0].product_id,"attributes":data[0].attributes})
                            .then((data)=>{
                                var a1=JSON.parse(JSON.stringify(data))
                                if (data.length>0){
                                    let a=a1[0].quantity+1
                                    knex('save_for_later').update('quantity',a).where("item_id",a1[0].item_id)
                                    .then((data)=>{
                                        res.send("product_added_successfuly")
                                    })
                                }
                        
                            })
                        }
                        else{
                            jwt.verify(cookie,'prince',(err,data)=>{
                                knex('shopping_cart').select('*').where({'item_id':id,"cart_id":data.customer_id})
                                .then((data)=>{ 
                                    if (data.length==0){
                                        res.send('this is not your account')
                                    }
                                    else{
                                        knex('shopping_cart').select('*').where("item_id",id)
                                        .then((data)=>{
                                            knex('save_for_later').insert({
                                                "item_id":data[0].item_id,
                                                "cart_id":data[0].cart_id,
                                                "product_id":data[0].product_id,
                                                "attributes":data[0].attributes,
                                                "quantity":data[0].quantity,
                                                'buy_now':data[0].buy_now,
                                                'added_on':new Date
                                                }).then(()=>{
                                                    knex('shopping_cart').delete('*').where("item_id",id)
                                                    .then(()=>{
                                                        res.send('you saved this product for later')
                                                    })
                                                }).catch((err)=>{
                                                    res.send(err)
                                                })
                                        })
                                    }
                                })
                            })
                        }
                    })
                })
            }
        })
    })

    shoppingcart.get('/move_to_cart/:item_id',(req,res)=>{
        var id=req.params.item_id;
        var cookie=req.headers.cookie.slice(0,-10);
        jwt.verify(cookie,'prince',(err,data)=>{
            knex('save_for_later').select('*').where({"item_id":id,"cart_id":data.customer_id})
            .then((data)=>{
                if (data.length==0){
                    res.send("this product is not in your save cart")
                }
                else{
                    knex('shopping_cart').insert({
                        "item_id":data[0].item_id,
                        "cart_id":data[0].cart_id,
                        "product_id":data[0].product_id,
                        "attributes":data[0].attributes,
                        "quantity":data[0].quantity,
                        'buy_now':data[0].buy_now,
                        'added_on':new Date
                        }).then(()=>{
                            knex('save_for_later').delete('*').where("item_id",id)
                            .then(()=>{
                                res.send('this product is in your cart now')
                            })
                        }).catch((err)=>{
                            res.send(err)
                        })
                }
            })
        })
    })

    shoppingcart.get('/getSaved/:cart_id',(req,res)=>{
        var id = req.params.cart_id;
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{
            if(id==data.customer_id){
                knex('save_for_later').select('*').where("cart_id",id)
                .then((data)=>{
                    res.send(data)
                })
            }
            else{
                res.send('this cart is not yours so, please enter your cart_id id')
            }
        })
    })
    shoppingcart.get('/totalAmount/:item_id',(req,res)=>{
        var id=req.params.item_id;
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{
            knex.select('price','quantity').table('shopping_cart')
            .join('product',{'shopping_cart.product_id':'product.product_id'})
            .where({"item_id":id,'cart_id':data.customer_id})
            .then((data)=>{
                if(data.length==0){
                    res.send('this product is not save in your cart so, you have to save first')
                }
                else{
                    for (i of data){i.totalAmount=i.price*i.quantity}
                    res.send(data)
                    console.log('data get sucessfully');
                    
                }
            })
        })
    })

    shoppingcart.delete('/removeProduct/:item_id',(req,res)=>{
        var id=req.params.item_id;
        var cookie=req.headers.cookie.slice(0,-10)
        jwt.verify(cookie,'prince',(err,data)=>{
            knex('shopping_cart').delete('*').where({'item_id':id,'cart_id':data.customer_id})
            .then((data)=>{
                if (data==0){
                    res.send('this product is not in your cart so, you are not able to delete this')
                }
                else{
                    res.send('deleted Sucessfully')
                }
            })
        })
    })
}
