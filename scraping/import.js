require('dotenv').config();


const mongoose = require('mongoose');
const fs = require('fs');
const Papa = require('papaparse');

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
});

ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: "text" });

const Product = mongoose.model("Product", ProductSchema);

function parseArray(value) {
    if (!value || value.trim() === '') return [];
    return value.split(',').map(item => item.trim()).filter(item => item);
}

function parsePrice(priceStr) {
    if (!priceStr) return null;
    const cleaned = priceStr.toString().replace(/[^0-9.]/g, '');
    const price = parseFloat(cleaned);
    return isNaN(price) ? null : price;
}


async function importProducts() {
    try {
        // connect
        const MONGO_SRV = process.env.MONGO_SRV;
        await mongoose.connect(MONGO_SRV);
        console.log('Connected to MongoDB');

        const csvPath = process.argv[2] || './products.csv';
        const csvFile = fs.readFileSync(csvPath, 'utf8');
        console.log(`Reading CSV file: ${csvPath}`);

        const { data, errors } = Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim()
        });

        if (errors.length > 0) {
            console.warn('CSV parsing warnings:', errors);
        }

        console.log(`Parsed ${data.length} rows from CSV`);

        // data to schema
        const products = data.map((row, index) => {
            try {
                return {
                    name: row.name?.trim() || '',
                    brand: row.brand?.trim() || null,
                    category: row.category?.trim() || '',
                    subcategory: row.subcategory?.trim() || null,
                    price: parsePrice(row.price),
                    size: row.size?.trim() || null,
                    skin_type: parseArray(row.skin_type),
                    skincare_concerns: parseArray(row.skincare_concerns),
                    ingredients: parseArray(row.ingredients),
                    highlighted_ingredients: parseArray(row.highlighted_ingredients),
                    image_url: row.image_url?.trim() || null,
                    url: row.url?.trim() || null,
                    what_it_is: row.what_it_is?.trim() || null,
                };
            } catch (err) {
                console.error(`Error processing row ${index + 1}:`, err.message);
                return null;
            }
        }).filter(product => product !== null);

        console.log(`Transformed ${products.length} products`);

        const invalidProducts = products.filter(p => !p.name || !p.category);
        if (invalidProducts.length > 0) {
            console.warn(`Found ${invalidProducts.length} products missing required fields (name or category)`);
        }

        // insert products
        if (products.length > 0) {
            const result = await Product.insertMany(products, { ordered: false });
            console.log(`Successfully imported ${result.length} products`);
        } else {
            console.log('No valid products to import');
        }

    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('\n✓ Disconnected from MongoDB');
    }
}

importProducts();
