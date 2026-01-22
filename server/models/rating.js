const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user_name: String,
  rating_value: String,
  product: String,
  brand: String,
  image: String,
  content: String,
});

module.exports = mongoose.model("rating", RatingSchema);
