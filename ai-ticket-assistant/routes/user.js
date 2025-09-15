import express from "express";
import {
  getUsers,
  login,
  signup,
  updateUser,
  logout,
  getDashboardStats,
} from "../controllers/user.js";

import { authenticate, requireAdmin } from "../middlewares/auth.js";
const router = express.Router();

// Admin-only routes
router.post("/update-user", authenticate, requireAdmin, updateUser);
router.get("/users", authenticate, requireAdmin, getUsers);
router.get("/dashboard-stats", authenticate, requireAdmin, getDashboardStats);

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
