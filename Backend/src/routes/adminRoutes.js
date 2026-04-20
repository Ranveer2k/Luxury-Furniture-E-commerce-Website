import express from "express";

import {
  getDashboardStats,
  getUsers,
  updateUserRole,
} from "../controllers/adminController.js";
import { authorize, protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));
router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.patch("/users/:id/role", updateUserRole);

export default router;