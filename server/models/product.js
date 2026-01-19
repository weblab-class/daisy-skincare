const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true, index: true},
    brand: String,

    category: {type: String, required: true, index: true},
    subcategory: {type: String, default: null, index: true},

    price: Number,
    size: String,

    skin_type: [String],
    concerns: [String],
    ingredients: [String],

    image_url: String,
    product_url: String,
})

ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: "text" });

module.exports =  mongoose.model("Product",ProductSchema)
