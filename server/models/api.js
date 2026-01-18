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

// post new product
router.post("/product", auth.ensureLoggedIn, async (req,res)=>{
  try{
    const newProduct = new Product(req.body);
    newProduct.save().then((product)=> res.send(product));

  } catch (err) {
    console.error("error creating product: ", err)
  }
});

// search filter
const buildFilter = (query)=>{
  const filter = {}
  const fields = [
      'category',
      'subcategory',
      'brand'];

  fields.forEach((field) =>{
    if (query[field]){
      filter[field] = query[field]
    }
  })

  // text search
  if (query.search){
    filter.$text = {$search: query.search}
  }

  // price range
  if (query.minprice || query.maxprice){
    filter.price = {};
    if (query.minprice){
      filter.price.$gte = Number(query.minprice)
    }
    if (query.maxprice){
      filter.price.$lte = Number(query.maxprice)
    }
  }

  // skin type
  if (query.skin_type){
    filter.skin_type = {
      $in: query.skin_type.split(',')
    };
  }
  // skin concern
  if (query.skincare_concerns){
    filter.skincare_concerns = {
      $in: query.skincare_concerns.split(',')
    };
  }

  return filter
};

// get products by category
router.get("/products", async (req,res)=> {
  try{
    const filter = buildFilter(req.query);
    const products = await Product.find(filter);
    res.send(products)

  } catch (err) {
    console.log("error getting product: ", err)
    res.status(500)
    res.send({})
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
