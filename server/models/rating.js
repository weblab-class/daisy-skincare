const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user_id: String,
  rating_value: Number,
  product: String,
  product_id: String,
  brand: String,
  brand_id: String,
  image: String,
  content: String,
});

module.exports = mongoose.model("rating", RatingSchema);
