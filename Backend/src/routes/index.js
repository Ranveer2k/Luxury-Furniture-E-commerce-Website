import express from "express";

import adminRoutes from "./adminRoutes.js";
import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import productRoutes from "./productRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);
router.use("/orders", orderRoutes);
router.use("/payments", paymentRoutes);
router.use("/admin", adminRoutes);
router.use("/upload", uploadRoutes);

export default router;