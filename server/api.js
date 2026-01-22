/** Core backend router / API */

const express = require("express");
const router = express.Router();
const Product  = require("./models/product")


router.get("/test", (req, res) => {
  res.send({ message: "Example API endpoint" });
});


// implement GET /api/ratings endpoint

const review1 = {
  _id: "id1",
  user_name: "Grace Choi",
  rating_value: "6/10",
  product: "toner",
  brand: "A",
  image: "/images/duckg.png",
  content: "Was okay"
};

const review2 = {
  _id: "id2",
  user_name: "Ellie Slaughter",
  rating_value: "7/10",
  product: "serum",
  brand: "B",
  image: "/images/ducke.png",
  content: "Was good"
};

const review3 = {
  _id: "id3",
  user_name: "Sophia Song",
  rating_value: "8/10",
  product: "moisturizer",
  brand: "C",
  image: "/images/ducks.png",
  content: "Was great"
};

const ratings = [review1, review2, review3];

router.get("/ratings", (req, res) => {
  res.send(ratings);
});

// implement POST /api/ratings endpoint

router.post("/review", (req, res) => {
  const newReview = req.body;
  ratings.push(newReview);
  res.send(newReview);
})

// implement GET /api/comments endpoint

const comment1 = {
  _id: "commentid1",
  creator_name: "XYZ",
  parent: "id1",
  content: "Insightful",
};
const comment2 = {
  _id: "commentid2",
  creator_name: "LMNOP",
  parent: "id2",
  content: "Wonderful",
};
const comment3 = {
  _id: "commentid3",
  creator_name: "ABCDE",
  parent: "id1",
  content: "Amazing",
};
const comments = [comment1, comment2, comment3];

router.get("/comments", (req, res) => {
  res.send(comments.filter((comment) => comment.parent === req.query.parent));
});

// implement POST /api/comment endpoint

router.post("/comment", (req, res) => {
  const newComment = req.body;
  comments.push(newComment);
  res.send(newComment);
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
