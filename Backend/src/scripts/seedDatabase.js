import mongoose from "mongoose";
import dotenv from "dotenv";
import { fetchImages } from "../utils/imageFetcher.js";
import {
  uploadMultipleImages,
  getThumbnailUrl,
  autoTagImage
} from "../utils/cloudinaryHelper.js";
import Product from "../models/Product.js";
import logger from "../utils/logger.js";

// Load environment variables
dotenv.config();

const CATEGORIES = [
  "wood-furniture",
  "epoxy-furniture",
  "chairs",
  "beds",
  "sofas",
  "tables",
  "doors",
  "epoxy-art-products"
];

const MATERIALS = {
  "wood-furniture": ["teak", "oak", "walnut", "mahogany", "pine"],
  "epoxy-furniture": ["epoxy-resin"],
  "chairs": ["teak", "oak", "walnut", "leather", "metal"],
  "beds": ["teak", "oak", "walnut", "pine"],
  "sofas": ["leather", "fabric", "metal"],
  "tables": ["teak", "oak", "walnut", "epoxy-resin", "metal"],
  "doors": ["teak", "oak", "walnut", "mahogany"],
  "epoxy-art-products": ["epoxy-resin"]
};

const PRODUCT_NAMES = {
  "wood-furniture": [
    "Luxury Teak Dining Set",
    "Handcrafted Oak Cabinet",
    "Walnut Executive Desk",
    "Mahogany Bookshelf",
    "Pine Storage Unit",
    "Solid Wood Wardrobe",
    "Carved Wooden Console",
    "Antique Style Sideboard"
  ],
  "epoxy-furniture": [
    "Crystal Clear Epoxy Table",
    "Blue Ocean Resin Dining Table",
    "Galaxy Epoxy Coffee Table",
    "Floral Resin Side Table",
    "Abstract Art Epoxy Desk",
    "Nature Inspired Resin Table",
    "Geometric Pattern Epoxy Piece",
    "Custom Resin Furniture"
  ],
  "chairs": [
    "Executive Leather Chair",
    "Modern Wooden Armchair",
    "Designer Accent Chair",
    "Classic Dining Chair",
    "Ergonomic Office Chair",
    "Velvet Upholstered Chair",
    "Minimalist Wooden Chair",
    "Luxury Recliner Chair"
  ],
  "beds": [
    "King Size Wooden Bed",
    "Platform Bed Frame",
    "Upholstered Bed Frame",
    "Storage Bed with Drawers",
    "Canopy Bed Frame",
    "Modern Bed with Headboard",
    "Wooden Bed with Storage",
    "Luxury Bed Ensemble"
  ],
  "sofas": [
    "Luxury Leather Sofa",
    "Modern Sectional Sofa",
    "Designer Loveseat",
    "Velvet Chesterfield Sofa",
    "Modular Sofa Set",
    "Compact Sofa Bed",
    "Corner Sofa Suite",
    "Premium Sofa Collection"
  ],
  "tables": [
    "Extendable Dining Table",
    "Marble Top Coffee Table",
    "Wooden Console Table",
    "Glass Top Side Table",
    "Industrial Style Desk",
    "Round Dining Table",
    "Folding Console Table",
    "Designer Center Table"
  ],
  "doors": [
    "Solid Wood Entrance Door",
    "Carved Wooden Door",
    "Modern Interior Door",
    "French Style Door",
    "Sliding Wooden Door",
    "Paneled Wooden Door",
    "Custom Wooden Door",
    "Decorative Door Design"
  ],
  "epoxy-art-products": [
    "Epoxy Resin Coasters Set",
    "Crystal Clear Resin Tray",
    "Floral Epoxy Wall Art",
    "Abstract Resin Jewelry Box",
    "Nature Scene Epoxy Art",
    "Geometric Resin Decor",
    "Custom Epoxy Key Holder",
    "Miniature Resin Sculpture"
  ]
};

function generateProductData(category, images, index) {
  const names = PRODUCT_NAMES[category];
  const materials = MATERIALS[category];

  const name = names[index % names.length];
  const material = materials[Math.floor(Math.random() * materials.length)];

  // Generate price based on category
  const basePrices = {
    "wood-furniture": 15000,
    "epoxy-furniture": 25000,
    "chairs": 8000,
    "beds": 35000,
    "sofas": 45000,
    "tables": 12000,
    "doors": 18000,
    "epoxy-art-products": 3000
  };

  const basePrice = basePrices[category];
  const price = basePrice + Math.floor(Math.random() * (basePrice * 0.5));

  // Create image objects
  const productImages = images.slice(0, Math.min(50, images.length)).map((img, imgIndex) => ({
    url: img.url,
    publicId: img.publicId || `luxury-furniture/${category}/${Date.now()}-${imgIndex}`,
    alt: img.alt,
    isPrimary: imgIndex === 0,
    tags: img.tags || []
  }));

  const thumbnail = productImages[0] ? {
    url: getThumbnailUrl(productImages[0].publicId),
    publicId: productImages[0].publicId
  } : null;

  return {
    name: `${name} ${index + 1}`,
    description: `Premium ${material} ${category.replace('-', ' ')} crafted with attention to detail. Features high-quality materials and expert craftsmanship for lasting durability and elegance.`,
    price,
    discountPrice: Math.random() > 0.7 ? price * 0.8 : undefined, // 30% chance of discount
    category,
    material,
    images: productImages,
    thumbnail,
    stockQuantity: Math.floor(Math.random() * 50) + 10,
    ratingsAverage: (Math.random() * 2) + 3, // 3-5 stars
    ratingsCount: Math.floor(Math.random() * 100) + 5,
    popularityScore: Math.floor(Math.random() * 1000),
    dimensions: {
      length: Math.floor(Math.random() * 200) + 50,
      width: Math.floor(Math.random() * 100) + 30,
      height: Math.floor(Math.random() * 100) + 40
    },
    weight: {
      value: Math.floor(Math.random() * 100) + 20
    },
    tags: [material, category.replace('-', ' '), 'luxury', 'premium', 'handcrafted'],
    seoTitle: `${name} - Luxury ${material} ${category.replace('-', ' ')}`,
    seoDescription: `Discover our premium ${name}, crafted from finest ${material}. Perfect for modern luxury homes.`
  };
}

async function seedCategory(category) {
  logger.info(`Starting to seed category: ${category}`);

  try {
    // Fetch premium images from APIs (10-20 images per category)
    const rawImages = await fetchImages(category, 20); // Request 20 images per category
    logger.info(`Fetched ${rawImages.length} premium images for ${category}`);

    if (rawImages.length < 10) {
      logger.warn(`Only ${rawImages.length} images found for ${category}, minimum required is 10`);
    }

    // Upload images to Cloudinary with premium optimization
    const imageUrls = rawImages.map(img => img.url);
    const uploadedImages = await uploadMultipleImages(
      imageUrls,
      `luxury-furniture/${category}`,
      (completed, total) => {
        logger.info(`Uploaded ${completed}/${total} premium images for ${category}`);
      }
    );

    logger.info(`Successfully uploaded ${uploadedImages.length} images to Cloudinary for ${category}`);

    // Create products (fewer products with more images each)
    const products = [];
    const numProducts = Math.min(8, Math.floor(uploadedImages.length / 8)); // At least 8 images per product

    for (let i = 0; i < numProducts; i++) {
      const startIndex = i * 8;
      const endIndex = Math.min(startIndex + 15, uploadedImages.length); // 8-15 images per product
      const productImages = uploadedImages.slice(startIndex, endIndex);

      if (productImages.length >= 8) {
        const productData = generateProductData(category, productImages, i);
        products.push(productData);
      }
    }

    // Insert products into database
    if (products.length > 0) {
      await Product.insertMany(products);
      logger.info(`Created ${products.length} premium products for category ${category}`);
    }

    return {
      category,
      imagesFetched: rawImages.length,
      imagesUploaded: uploadedImages.length,
      productsCreated: products.length
    };

  } catch (error) {
    logger.error(`Error seeding category ${category}:`, error);
    throw error;
  }
}

async function clearExistingData() {
  logger.info("Clearing existing product data...");
  await Product.deleteMany({});
  logger.info("Existing data cleared");
}

async function runSeeder() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing data
    await clearExistingData();

    // Seed each category
    const results = [];
    for (const category of CATEGORIES) {
      try {
        const result = await seedCategory(category);
        results.push(result);

        // Delay between categories to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        logger.error(`Failed to seed category ${category}:`, error.message);
      }
    }

    // Summary
    const totalImages = results.reduce((sum, r) => sum + r.imagesUploaded, 0);
    const totalProducts = results.reduce((sum, r) => sum + r.productsCreated, 0);

    logger.info("Seeding completed!");
    logger.info(`Total categories processed: ${results.length}`);
    logger.info(`Total images uploaded: ${totalImages}`);
    logger.info(`Total products created: ${totalProducts}`);

    console.log("\n=== SEEDING SUMMARY ===");
    results.forEach(result => {
      console.log(`${result.category}: ${result.productsCreated} products, ${result.imagesUploaded} images`);
    });

  } catch (error) {
    logger.error("Seeding failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Run seeder if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runSeeder();
}

export default runSeeder;