import express from "express";

import {
  createReview,
  getProductReviews,
} from "../controllers/reviewController.js";
import { protect } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import { createReviewValidation } from "../validations/reviewValidation.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);
router.post("/", protect, createReviewValidation, validate, createReview);

export default router;