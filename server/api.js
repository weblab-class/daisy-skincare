/** Core backend router / API */

const express = require("express");
const router = express.Router();
const Product  = require("./models/product");
const Rating = require("./models/rating");
const Comment = require("./models/comment");


router.get("/test", (req, res) => {
  res.send({ message: "Example API endpoint" });
});


// implement GET /api/ratings endpoint
router.get("/ratings", (req, res) => {
  Rating.find({}).then((ratings) => {
    res.send(ratings);
  });
});

// implement POST /api/ratings endpoint
router.post("/rating", (req, res) => {
  const newReview = new Rating({
    user_name: "New User", // Hardcoded for now
    rating_value: `${req.body.rating_value}/5`, // Format rating value
    product: req.body.product,
    brand: req.body.brand,
    image: req.body.image,
    content: req.body.content,
  });

  newReview.save().then((rating) => res.send(rating));
})

// implement GET /api/comments endpoint
router.get("/comments", (req, res) => {
  Comment.find({ parent: req.query.parent }).then((comments) => {
    res.send(comments);
  });
});

// implement POST /api/comment endpoint
router.post("/comment", (req, res) => {
  const newComment = new Comment({
    creator_name: req.body.creator_name,
    parent: req.body.parent,
    content: req.body.content,
  });

  newComment.save().then((comment) => res.send(comment));
});


// implement POST /api/product endpoint
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


module.exports = router;
