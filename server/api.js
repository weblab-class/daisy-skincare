// backend router and api
const express = require("express");
const router = express.Router();
const socketManager = require("./server-socket");

// mongo schema imports
const Product = require("./models/product");
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

// POST /api/rating – if product/brand is new, create in Product collection; always create/update rating
router.post("/rating", auth.ensureLoggedIn, async (req, res) => {
  try {
    console.log("req.body:", req.body);
    const productName = (req.body.product || "").trim();
    const brandName = (req.body.brand || "").trim();
    const productId = req.body.product_id;
    let image = req.body.image; // ADD THIS LINE

    if (productName || brandName) {
      try {
        const nameToUse = productName || brandName;
        const query = { name: nameToUse };
        if (brandName) {
          query.brand = brandName;
        } else {
          query.$or = [{ brand: null }, { brand: "" }, { brand: { $exists: false } }];
        }
        const existing = await Product.findOne(query);
        if (existing) {
          image = existing.image_url;
        }
        if (!existing) {
          await Product.create({
            name: nameToUse,
            brand: brandName || undefined,
            category: "Uncategorized",
            image_url: req.body.image,
          });
        }
      } catch (err) {
        console.error("Product create error (rating will still be saved):", err);
      }
    }

    // Build the query to find existing rating
    const query = { user_id: req.user._id };
    query.product = productName;
    query.brand = brandName;

    console.log("Searching for existing rating with query:", query);
    const existingRating = await Rating.findOne(query);

    if (existingRating) {
      // Update existing rating
      existingRating.rating_value = req.body.rating_value;
      existingRating.content = req.body.content;
      existingRating.product = req.body.product;
      existingRating.brand = req.body.brand;
      existingRating.image = image;
      existingRating.user_name = req.user.name;
      existingRating.user_id = req.user._id;

      if (productId) {
        existingRating.product_id = productId;
      }

      const updatedRating = await existingRating.save();
      console.log("Updated existing rating:", updatedRating);
      res.send(updatedRating);
    } else {
      // Create new rating
      const newReview = new Rating({
        user_id: req.user._id,
        user_name: req.user.name,
        product_id: productId,
        rating_value: req.body.rating_value,
        product: req.body.product,
        brand: req.body.brand,
        image: image,
        content: req.body.content,
      });
      console.log("Creating new review:", newReview);
      const rating = await newReview.save();
      res.send(rating);
    }
  } catch (err) {
    console.error("POST /rating error:", err);
    res.status(500).send({ error: "Failed to save rating" });
  }
});

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
  User.findById(req.query.userid)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send("User Not");
    });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  res.send({});
});

// GET /api/userratings endpoint
router.get("/userratings", auth.ensureLoggedIn, (req, res) => {
  console.log("user ids on backend", req.query.user_id);
  Rating.find({ user_id: req.query.user_id })
    .sort({ _id: -1 }) // newest first
    .then((ratings) => {
      console.log(ratings);
      res.send(ratings);
    });
});

/////////////////////////////

// POST /api/product endpoint
router.post("/product", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    newProduct.save().then((product) => res.send(product));
  } catch (err) {
    console.error("error creating product: ", err);
  }
});

// search filter
const buildFilter = (query) => {
  const filter = {};
  const fields = ["category", "subcategory", "brand"];

  fields.forEach((field) => {
    if (query[field]) {
      filter[field] = query[field];
    }
  });

  // text search
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  // price range
  if (query.minprice || query.maxprice) {
    filter.price = {};
    if (query.minprice) {
      filter.price.$gte = Number(query.minprice);
    }
    if (query.maxprice) {
      filter.price.$lte = Number(query.maxprice);
    }
  }

  // skin type
  if (query.skin_type) {
    filter.skin_type = {
      $in: query.skin_type.split(","),
    };
  }

  // skin concern
  if (query.skincare_concerns) {
    filter.skincare_concerns = {
      $in: query.skincare_concerns.split(","),
    };
  }

  // ingredient
  if (query.ingredients) {
    filter.ingredients = {
      $in: query.ingredients.split(","),
    };
  }

  //highlighted_ingredients
  if (query.highlighted_ingredients) {
    filter.highlighted_ingredientsingredients = {
      $in: query.highlighted_ingredients.split(","),
    };
  }

  return filter;
};

// GET /api/products/:id/ratings endpoint
router.get("/products/:id/ratings", async (req, res) => {
  try {
    const productId = req.params.id;
    const userID = req.user?._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }

    const ratingQuery = { product: product.name };
    if (product.brand) {
      ratingQuery.brand = product.brand;
    }

    const allRatings = await Rating.find(ratingQuery);

    const response = {
      userRating: null,
      userReview: null,
      otherReviews: [],
      friendsAverage: null,
      friendsCount: 0,
      overallAverage: null,
      overallCount: allRatings.length
    };

    if (allRatings.length > 0) {
      const sum = allRatings.reduce((total, r) => total + (r.rating_value || 0), 0);
      response.overallAverage = sum / allRatings.length;
    }

    if (userID) {
      // Convert userID to string for comparison
      const userIdString = userID.toString();

      // Find user's rating by comparing ObjectId strings
      const userRatingDoc = allRatings.find(r => r.user_id === userIdString);
      if (userRatingDoc) {
        response.userRating = userRatingDoc?.rating_value || null;
        if (userRatingDoc.content) {
          response.userReview = {id: userRatingDoc._id, content: userRatingDoc.content, rating_value: userRatingDoc.rating_value, user_name: userRatingDoc.user_name};
        }
      }

      // Get user's friends
      const user = await User.findById(userID);

      if (user && user.friends && user.friends.length > 0) {
        // Convert friend ObjectIds to strings
        const friendIdStrings = user.friends.map(id => id.toString());

        // Filter ratings from friends (excluding current user)
        const friendRatings = allRatings.filter(r =>
          friendIdStrings.includes(r.user_id) && r.user_id !== userIdString
        );

        response.friendsCount = friendRatings.length;

        if (friendRatings.length > 0) {
          const friendSum = friendRatings.reduce((total, r) => total + (r.rating_value || 0), 0);
          response.friendsAverage = friendSum / friendRatings.length;
        }
      }

      response.otherReviews = allRatings.filter(r => r.user_id !== userID);
      response.otherReviews = response.otherReviews.map(r => ({
        id: r._id,
        content: r.content,
        created_at: r.created_at,
        rating_value: r.rating_value,
        user_name: r.user_name,
        user_id: r.user_id,
      }));
    }

    res.send(response);

  } catch (err) {
    console.error("Error fetching product ratings:", err);
    res.status(500).send({ error: 'Failed to fetch ratings' });
  }
});

// POST /api/products/:id/rate - Add/update a quick rating for a product
router.post("/products/:id/rate", auth.ensureLoggedIn, async (req, res) => {
  try {
    const productId = req.params.id;
    const { rating_value,content } = req.body;

    // Validate rating
    if (!rating_value || rating_value < 1 || rating_value > 5) {
      return res.status(400).send({ error: 'Rating must be between 1 and 5' });
    }

    // Get the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ error: 'Product not found' });
    }

    // Build query to find existing rating
    const existingQuery = {
      user_id: req.user._id,
      product: product.name
    };
    if (product.brand) {
      existingQuery.brand = product.brand;
    }

    // Check if user already has a rating for this product
    const existingRating = await Rating.findOne(existingQuery);

    if (existingRating) {
      // Update existing rating
      existingRating.rating_value = rating_value;
      existingRating.content = content;
      await existingRating.save();
      res.send(existingRating);
    } else {
      // Create new rating
      const newRating = new Rating({
        user_id: req.user._id,
        user_name: req.user.name,
        rating_value: rating_value,
        product: product.name,
        brand: product.brand || '',
        image: product.image_url || '',
        content: content,
      });
      const savedRating = await newRating.save();
      res.send(savedRating);
    }

  } catch (err) {
    console.error("Error saving product rating:", err);
    res.status(500).send({ error: 'Failed to save rating' });
  }
});

// implement GET /api/products/:id endpoint
router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "product not found" });
    }
    res.send(product);
  } catch (err) {
    console.log("error getting product: ", err);
    res.status(500).send({ error: "couldnt get product" });
  }
});

// GET /api/brands – distinct brands from products, optional search, limit
router.get("/brands", async (req, res) => {
  try {
    const { search, limit } = req.query;
    const cap = Math.min(Math.max(Number(limit) || 15, 1), 50);
    const match = {};
    if (search && String(search).trim()) {
      match.brand = { $regex: String(search).trim(), $options: "i" };
    } else {
      match.brand = { $exists: true, $nin: [null, ""] };
    }
    const rows = await Product.aggregate([
      { $match: match },
      { $group: { _id: "$brand" } },
      { $sort: { _id: 1 } },
      { $limit: cap },
    ]);
    res.send(rows.map((r) => r._id).filter(Boolean));
  } catch (err) {
    console.error("error getting brands:", err);
    res.status(500);
    res.send([]);
  }
});

// implement GET /api/products endpoint
router.get("/products", async (req, res) => {
  try {
    const { search, limit } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { what_it_is: { $regex: search, $options: "i" } },
        ],
      };
    }
    let q = Product.find(query);
    if (limit && Number(limit) > 0) {
      q = q.limit(Number(limit)).select("name _id");
    }
    const products = await q;
    res.send(products);
  } catch (err) {
    console.log("error getting product:", err);
    res.status(500);
    res.send([]);
  }
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
