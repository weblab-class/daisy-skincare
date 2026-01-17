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

module.exports =  mongoose.model("Product",ProductSchema)
