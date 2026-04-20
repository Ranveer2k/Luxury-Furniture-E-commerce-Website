import express from "express";

import { uploadImages } from "../controllers/uploadController.js";
import { authorize, protect } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = express.Router();

router.post(
  "/images",
  protect,
  authorize("admin"),
  upload.array("images", 6),
  uploadImages,
);

export default router;