import express from "express";

import {
  createRazorpayOrder,
  createStripeCheckoutSession,
  verifyPayment,
} from "../controllers/paymentController.js";
import { protect } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import { verifyPaymentValidation } from "../validations/orderValidation.js";

const router = express.Router();

router.use(protect);
router.post("/stripe/checkout-session", createStripeCheckoutSession);
router.post("/razorpay/order", createRazorpayOrder);
router.post("/verify", verifyPaymentValidation, validate, verifyPayment);

export default router;