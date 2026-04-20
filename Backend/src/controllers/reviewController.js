import Product from "../models/Product.js";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/response.js";

export const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, product: productId },
    { rating, comment, user: req.user._id, product: productId },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  await Review.calcAverageRatings(product._id);

  sendSuccess(res, 201, "Review submitted successfully", { review });
});

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate(
    "user",
    "name",
  );

  sendSuccess(res, 200, "Reviews fetched successfully", { reviews });
});