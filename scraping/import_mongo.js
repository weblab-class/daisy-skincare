import fs from "fs";
import csv from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ProductSchema from "/Users/sophiasong/Desktop/weblab project/ssong3200-erslaugh-gracec32/server/models/models/product.js";

dotenv.config();
console.log(process.env.mongoURL);

const mongoConnectionURL = process.env.MONGO_SRV;

async function connectDB() {
  await mongoose.connect("mongodb+srv://ssong3200_db_user:Daisy5-10@Skincare.mongodb.net/database?retryWrites=true&w=majority");
  console.log("✅ MongoDB connected");


}

function parseList(str) {
  if (!str) return [];
  return str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function importCSV() {
  await connectDB();

  const products = [];

  fs.createReadStream("/Users/sophiasong/Desktop/weblab project/ssong3200-erslaugh-gracec32/data/product_info_final_categorized.csv")
    .pipe(csv())
    .on("data", (row) => {
      products.push({
        name: row.name,
        brand: row.brand,
        price: Number(row.price?.replace("$", "")) || null,
        category: row.category,
        subcategory: row.subcategory || null,
        skin_type: parseList(row.skin_type),
        skincare_concerns: parseList(row.skincare_concerns),
        ingredients: row.ingredients || "",
        image_url: row.main_image_url || "",
      });
    })
    .on("end", async () => {
      try {
        await ProductSchema.insertMany(products, { ordered: false });
        console.log(`✅ Imported ${products.length} products`);
      } catch (err) {
        console.error("❌ Import error:", err.message);
      } finally {
        mongoose.disconnect();
      }
    });
}

importCSV();
