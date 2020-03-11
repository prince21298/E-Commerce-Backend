module.exports=(orders,knex,jwt)=>{
    orders.post("/",(req,res)=>{
        var cookie=req.headers.cookie.slice(0,-10);
        cart_id=jwt.verify(cookie,"prince").customer_id
        var ship_id=req.body.shipping_id
        var tax_id=req.body.tax_id
        var date =new Date
        knex('shopping_cart').select('*')
        .join('product','shopping_cart.product_id','product.product_id')
        .where('cart_id',cart_id)
        .then((data)=>{
            if (data.length!=0){
                var total_amount=0
                for (i of data){total_amount+=i.price*i.quantity}
                knex('shipping').select('shipping_cost').where('shipping_id',ship_id)
                .then((ship_data)=>{
                    total_amount+=(ship_data[0].shipping_cost)
                    knex('tax').select('*').where('tax_id',tax_id)
                    .then((tax_data)=>{
                        var tax_percentage=tax_data[0].tax_percentage
                        var tax=(tax_percentage*total_amount)/100
                        total_amount+=tax
                        knex('orders').insert({
                            'total_amount':total_amount,
                            'created_on':date,
                            'shipping_id':ship_id,
                            'tax_id':tax_id,'status':1,
                            'customer_id':cart_id
                        })
                        .then(()=>{
                            knex('shopping_cart').update({'buy_now':0}).where('cart_id',cart_id)
                            .then(()=>{
                                res.send("order sucessfully")
                                console.log("order sucessfully");
                                
                            })
                            .catch((err)=>{
                                res.send(err)
                            })
                        })
                    })
                })
            }
            else{
                res.send("something is wrong in your cart")
            }
        })
        .catch((err)=>{
            res.send(err)
        })
    })



}