const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true, index: true},
    brand: String,

    category: {type: String, required: true, index: true},
    subcategory: {type: String, default: null, index: true},

    price: Number,
    size: String,

    skin_type: [String],
    skincare_concerns: [String],
    ingredients: [String],
    highlighted_ingredients: [String],

    image_url: String,
    url: String,
    what_it_is: String,
})

ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: "text" });

module.exports =  mongoose.model("Product", ProductSchema)
