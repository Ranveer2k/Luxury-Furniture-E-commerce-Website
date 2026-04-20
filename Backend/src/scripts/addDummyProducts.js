import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import logger from "../utils/logger.js";

// Load environment variables
dotenv.config();

const dummyProducts = [
  {
    name: "Luxury Teak Dining Table",
    description: "Handcrafted teak dining table with modern design",
    price: 2500,
    category: "tables",
    material: "teak",
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        alt: "Luxury teak dining table"
      }
    ],
    stockQuantity: 10,
    isActive: true,
    dimensions: { length: 200, width: 100, height: 75 },
    weight: 50,
    tags: ["dining", "teak", "modern"],
    ratingsAverage: 4.5,
    ratingsCount: 12
  },
  {
    name: "Premium Leather Sofa",
    description: "Elegant leather sofa for luxury living rooms",
    price: 3200,
    category: "sofas",
    material: "leather",
    images: [
      {
        url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
        alt: "Premium leather sofa"
      }
    ],
    stockQuantity: 5,
    isActive: true,
    dimensions: { length: 220, width: 90, height: 85 },
    weight: 80,
    tags: ["sofa", "leather", "luxury"],
    ratingsAverage: 4.8,
    ratingsCount: 8
  },
  {
    name: "Designer Wooden Chair",
    description: "Contemporary wooden chair with ergonomic design",
    price: 450,
    category: "chairs",
    material: "oak",
    images: [
      {
        url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
        alt: "Designer wooden chair"
      }
    ],
    stockQuantity: 15,
    isActive: true,
    dimensions: { length: 50, width: 50, height: 90 },
    weight: 12,
    tags: ["chair", "oak", "ergonomic"],
    ratingsAverage: 4.2,
    ratingsCount: 20
  }
];

const addDummyProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    logger.info("Cleared existing products");

    // Add dummy products
    await Product.insertMany(dummyProducts);
    logger.info(`Added ${dummyProducts.length} dummy products`);

    process.exit(0);
  } catch (error) {
    logger.error("Error adding dummy products:", error);
    process.exit(1);
  }
};

addDummyProducts();