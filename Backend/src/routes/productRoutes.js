import express from "express";

import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getProductsByCategory,
  getCategories,
  addProductImages,
  removeProductImage,
  setPrimaryImage,
  searchProducts,
  getRecommendations,
} from "../controllers/productController.js";
import { authorize, protect } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import {
  createProductValidation,
  listProductsValidation,
  updateProductValidation,
} from "../validations/productValidation.js";

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get products with advanced filters, sorting, and pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, rating, popularity, newest]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: detailed
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Product list with pagination
 */
router.get("/", listProductsValidation, validate, getProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Advanced product search
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: material
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Search results
 */
router.get("/search", searchProducts);

/**
 * @swagger
 * /products/categories:
 *   get:
 *     summary: Get all categories with statistics
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Categories list with counts and averages
 */
router.get("/categories", getCategories);

/**
 * @swagger
 * /products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products in category
 */
router.get("/category/:category", getProductsByCategory);

/**
 * @swagger
 * /products/recommendations:
 *   get:
 *     summary: Get product recommendations
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: excludeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recommended products
 */
router.get("/recommendations", getRecommendations);

// Product CRUD operations
router.get("/:id", getProductById);

router.post(
  "/",
  protect,
  authorize("admin"),
  createProductValidation,
  validate,
  createProduct,
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateProductValidation,
  validate,
  updateProduct,
);

router.delete("/:id", protect, authorize("admin"), deleteProduct);

// Image management routes
/**
 * @swagger
 * /products/{id}/images:
 *   post:
 *     summary: Add images to product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Images added successfully
 */
router.post("/:id/images", protect, authorize("admin"), addProductImages);

/**
 * @swagger
 * /products/{id}/images/{imageId}:
 *   delete:
 *     summary: Remove image from product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: deleteFromCloudinary
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Image removed successfully
 */
router.delete("/:id/images/:imageId", protect, authorize("admin"), removeProductImage);

/**
 * @swagger
 * /products/{id}/images/{imageId}/primary:
 *   patch:
 *     summary: Set image as primary
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: imageId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Primary image updated
 */
router.patch("/:id/images/:imageId/primary", protect, authorize("admin"), setPrimaryImage);

export default router;