const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user_id: String,
  rating_value: Number,
  product: String,
  brand: String,
  image: String,
  content: String,
});

module.exports = mongoose.model("rating", RatingSchema);
