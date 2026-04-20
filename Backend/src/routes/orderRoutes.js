import express from "express";

import {
  createOrderFromCart,
  getAllOrders,
  getMyOrders,
  markOrderPaid,
} from "../controllers/orderController.js";
import { authorize, protect } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import { createOrderValidation } from "../validations/orderValidation.js";

const router = express.Router();

router.use(protect);
router.post("/", createOrderValidation, validate, createOrderFromCart);
router.get("/me", getMyOrders);
router.get("/", authorize("admin"), getAllOrders);
router.patch("/:id/paid", authorize("admin"), markOrderPaid);

export default router;