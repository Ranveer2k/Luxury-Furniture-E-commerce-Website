import express from "express";

import {
  addOrUpdateCartItem,
  getCart,
  removeCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/auth.js";
import validate from "../middlewares/validate.js";
import { upsertCartValidation } from "../validations/cartValidation.js";

const router = express.Router();

router.use(protect);
router.get("/", getCart);
router.put("/", upsertCartValidation, validate, addOrUpdateCartItem);
router.delete("/:productId", removeCartItem);

export default router;