import express from "express";

import {
  addAddress,
  deleteAddress,
  getProfile,
  login,
  register,
  updateAddress,
  updatePassword,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import validate from "../middlewares/validate.js";
import {
  addressValidation,
  loginValidation,
  registerValidation,
  updatePasswordValidation,
  updateProfileValidation,
} from "../validations/authValidation.js";

const router = express.Router();

router.post("/register", authLimiter, registerValidation, validate, register);
router.post("/login", authLimiter, loginValidation, validate, login);
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfileValidation, validate, updateProfile);
router.put(
  "/me/password",
  protect,
  updatePasswordValidation,
  validate,
  updatePassword,
);
router.post("/me/addresses", protect, addressValidation, validate, addAddress);
router.put(
  "/me/addresses/:addressId",
  protect,
  addressValidation,
  validate,
  updateAddress,
);
router.delete("/me/addresses/:addressId", protect, deleteAddress);

export default router;