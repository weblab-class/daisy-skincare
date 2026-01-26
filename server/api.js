// backend router and api
const express = require("express");
const router = express.Router();
const socketManager = require("./server-socket");

// mongo schema imports
const Product  = require("./models/product");
const Rating = require("./models/rating");
const Comment = require("./models/comment");
const User = require("./models/user");
const auth = require("./auth");

// GET /api/feed endpoint
router.get("/feed", (req, res) => {
  Rating.find({}).then((ratings) => {
    res.send(ratings);
  });
});

// POST /api/rating endpoint
router.post("/rating", auth.ensureLoggedIn, (req, res) => {
  console.log("req.body:", req.body);
  const newReview = new Rating({
    user_id: req.user._id,
    user_name: req.user.name,
    rating_value: req.body.rating_value,
    product: req.body.product,
    brand: req.body.brand,
    image: req.body.image,
    content: req.body.content,
  });
  console.log("newReview:", newReview);

  newReview.save().then((rating) => res.send(rating));
})

// GET /api/commentsfeed endpoint
router.get("/commentsfeed", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

// POST /api/comments endpoint
router.post("/comment", auth.ensureLoggedIn, (req, res) => {
  console.log("req.body:", req.body);
  const newComment = new Comment({
    creator_id: req.user._id,
    creator_name: req.user.name,
    parent: req.body.parent,
    content: req.body.content,
  });
  console.log("newComment:", newComment);

  newComment.save().then((comment) => res.send(comment));
});

// login authentication
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // user is not logged in
    return res.send({});
  }
  res.send(req.user);
});

// GET /api/user endpoint
router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  }).catch((err) => {
    res.status(500).send('User Not');
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  res.send({});
});

// POST /api/product endpoint
router.post("/product", async (req,res)=>{
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

  // ingredient
  if (query.ingredients){
    filter.ingredients = {
      $in: query.ingredients.split(',')
    };
  }

  //highlighted_ingredients
  if (query.highlighted_ingredients){
    filter.highlighted_ingredientsingredients = {
      $in: query.highlighted_ingredients.split(',')
    };
  }

  return filter
};

// implement GET /api/products/:id endpoint
router.get("/products/:id",async (req,res)=> {
  try{
    const product = await Product.findById(req.params.id);
    if (!product){
      return res.status(404).send({error: 'product not found'})
    }
    res.send(product)
  } catch (err){
    console.log("error getting product: ", err)
    res.status(500).send({error: 'couldnt get product'})
  }
})

// implement GET /api/products endpoint
router.get("/products", async (req,res)=> {
  try{
    const {search} = req.query;

    let query = {};

    if (search){
      query = {
        $or: [
          {name: {$regex: search, $options: 'i'}},
          {what_it_is: {$regex: search, $options: 'i'}}
        ]
      }
    }

    const products = await Product.find(query);
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
