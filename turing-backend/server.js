const express=require("express");
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv').config()

var app = express();
app.use(express.json());


var knex = require('knex')({
	client: 'mysql',
	connection: {
	  host : process.env.DB_HOST,
	  user : process.env.DB_USER,
	  password : process.env.DB_PASSWORD,
	  database : process.env.DB_DATABASE
	}
  });
  


const department = express.Router();
app.use('/departments', department);
require('./router/department')(department,knex);


const categories = express.Router();
app.use("/categories",categories);
require('./router/categories')(categories,knex);

const attributes=express.Router();
app.use("/attributes",attributes);
require("./router/attributes")(attributes,knex)

const products=express.Router();
app.use('/products',products);
require("./router/products")(products,knex,jwt)

const customer=express.Router();
app.use("/",customer);
require("./router/customer")(customer,knex,jwt)

const shoppingcart=express.Router(); 
app.use('/shoppingcart',shoppingcart);
require('./router/shoppingcart')(shoppingcart,knex,jwt)

const orders=express.Router();
app.use("/orders",orders);
require('./router/orders')(orders,knex,jwt)


 app.listen(process.env.DB_PORT,()=>{
	 console.log("your server is started...... ");
 })