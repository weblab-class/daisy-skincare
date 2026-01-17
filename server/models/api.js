/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Product = require("./models/product")

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user)
    socketManager.addUser(
      req.user,
      socketManager.getSocketFromSocketID(req.body.socketid)
    );
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// get all products
router.get("/products",(req,res)=> {
  Product.find({}).then((products)=> res.send(products));
});

// post new product
router.post("/product", auth.ensureLoggedIn, (req,res)=>{
  const newProduct = new Product({req.body})
  newProduct.save().then((product)=> {res.send(product)})
});

// get products by category
router.get("/products", async (req,res)=> {
  try{
    const {category,subcategory} = req.query
    const filter = {};
    if (category) {
      filter.category = category
    }
    if (subcategory){
      filter.subcategory = subcategory
    }

    const products = await Product.find(filter);
    res.send(products)
  } catch (err) {
    console.log("error: ", err)
    res.status(200)
    res.send({})
  }
});

// get products by brand
router.get("/products", async(req,res)=>{
  try{
    const brand = req.query
    const filter = {};
    if (brand) {
      filter.brand = brand
    }
    const products = await Product.find(filter);
    res.send(products)
  } catch (err) {
    console.log("error: ", err)
    res.status(200)
    res.send({})
  }
})



// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
