import { body } from "express-validator";

export const upsertCartValidation = [
  body("productId").isMongoId(),
  body("quantity").isInt({ min: 1 }),
];