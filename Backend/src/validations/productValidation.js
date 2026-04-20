import { body, query } from "express-validator";

const VALID_CATEGORIES = [
  "wood-furniture",
  "epoxy-furniture",
  "chairs",
  "beds",
  "sofas",
  "tables",
  "doors",
  "epoxy-art-products"
];

const VALID_MATERIALS = [
  "teak",
  "sheesham",
  "oak",
  "walnut",
  "epoxy-resin",
  "mahogany",
  "pine",
  "bamboo",
  "metal",
  "leather"
];

export const createProductValidation = [
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Product description is required"),
  body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("discountPrice").optional().isFloat({ min: 0 }).withMessage("Discount price must be positive"),
  body("category").isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`),
  body("material").isIn(VALID_MATERIALS).withMessage(`Material must be one of: ${VALID_MATERIALS.join(", ")}`),
  body("images").isArray({ min: 1 }).withMessage("At least one image is required"),
  body("images.*.url").notEmpty().withMessage("Image URL is required"),
  body("stockQuantity").isInt({ min: 0 }).withMessage("Stock quantity must be a non-negative integer"),
  body("dimensions.length").optional().isFloat({ min: 0 }),
  body("dimensions.width").optional().isFloat({ min: 0 }),
  body("dimensions.height").optional().isFloat({ min: 0 }),
  body("weight.value").optional().isFloat({ min: 0 }),
  body("tags").optional().isArray(),
  body("seoTitle").optional().trim(),
  body("seoDescription").optional().trim(),
];

export const updateProductValidation = [
  body("name").optional().trim().notEmpty().withMessage("Product name cannot be empty"),
  body("description").optional().trim().notEmpty().withMessage("Product description cannot be empty"),
  body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
  body("discountPrice").optional().isFloat({ min: 0 }).withMessage("Discount price must be positive"),
  body("category").optional().isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`),
  body("material").optional().isIn(VALID_MATERIALS).withMessage(`Material must be one of: ${VALID_MATERIALS.join(", ")}`),
  body("images").optional().isArray({ min: 1 }).withMessage("At least one image is required"),
  body("images.*.url").optional().notEmpty().withMessage("Image URL is required"),
  body("stockQuantity").optional().isInt({ min: 0 }).withMessage("Stock quantity must be a non-negative integer"),
  body("dimensions.length").optional().isFloat({ min: 0 }),
  body("dimensions.width").optional().isFloat({ min: 0 }),
  body("dimensions.height").optional().isFloat({ min: 0 }),
  body("weight.value").optional().isFloat({ min: 0 }),
  body("tags").optional().isArray(),
  body("seoTitle").optional().trim(),
  body("seoDescription").optional().trim(),
  body("isActive").optional().isBoolean(),
];

export const listProductsValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("Minimum price must be positive"),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("Maximum price must be positive"),
  query("sort").optional().isIn([
    "price_asc",
    "price_desc",
    "rating",
    "popularity",
    "newest"
  ]).withMessage("Invalid sort option"),
  query("category").optional().isIn(VALID_CATEGORIES).withMessage(`Invalid category: ${VALID_CATEGORIES.join(", ")}`),
  query("material").optional().isIn(VALID_MATERIALS).withMessage(`Invalid material: ${VALID_MATERIALS.join(", ")}`),
  query("search").optional().trim(),
  query("tags").optional().trim(),
  query("detailed").optional().isBoolean(),
];

export const addImagesValidation = [
  body("imageUrls").isArray({ min: 1 }).withMessage("At least one image URL is required"),
  body("imageUrls.*").isURL().withMessage("Each image URL must be valid"),
  body("tags").optional().isArray(),
  body("tags.*").isString().trim(),
];

export const searchValidation = [
  query("q").notEmpty().withMessage("Search query is required"),
  query("category").optional().isIn(VALID_CATEGORIES),
  query("material").optional().isIn(VALID_MATERIALS),
  query("minPrice").optional().isFloat({ min: 0 }),
  query("maxPrice").optional().isFloat({ min: 0 }),
  query("sort").optional().isIn([
    "price_asc",
    "price_desc",
    "rating",
    "popularity",
    "newest"
  ]),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 50 }),
];