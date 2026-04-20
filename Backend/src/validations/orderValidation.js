import { body } from "express-validator";

export const createOrderValidation = [
  body("paymentProvider").isIn(["stripe", "razorpay"]),
  body("shippingAddress.fullName").trim().notEmpty(),
  body("shippingAddress.phone").trim().notEmpty(),
  body("shippingAddress.line1").trim().notEmpty(),
  body("shippingAddress.city").trim().notEmpty(),
  body("shippingAddress.state").trim().notEmpty(),
  body("shippingAddress.postalCode").trim().notEmpty(),
  body("shippingAddress.country").trim().notEmpty(),
];

export const verifyPaymentValidation = [
  body("provider").isIn(["stripe", "razorpay"]),
  body("orderId").optional().notEmpty(),
];