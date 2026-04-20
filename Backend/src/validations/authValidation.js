import { body } from "express-validator";

export const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const updateProfileValidation = [
  body("name").optional().trim().notEmpty(),
  body("email").optional().isEmail(),
];

export const updatePasswordValidation = [
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 6 }),
];

export const addressValidation = [
  body("label").trim().notEmpty(),
  body("fullName").trim().notEmpty(),
  body("phone").trim().notEmpty(),
  body("line1").trim().notEmpty(),
  body("city").trim().notEmpty(),
  body("state").trim().notEmpty(),
  body("postalCode").trim().notEmpty(),
  body("country").trim().notEmpty(),
];