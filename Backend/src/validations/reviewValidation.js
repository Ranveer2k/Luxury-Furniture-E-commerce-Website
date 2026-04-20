import { body } from "express-validator";

export const createReviewValidation = [
  body("productId").isMongoId(),
  body("rating").isInt({ min: 1, max: 5 }),
  body("comment").trim().notEmpty(),
];