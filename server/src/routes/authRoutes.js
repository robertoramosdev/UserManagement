import express from "express";
import {
  signupUser,
  loginUser,
  signupAdmin,
  loginAdmin,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Normal user
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Admin user
router.post("/admin/signup", signupAdmin);
router.post("/admin/login", loginAdmin);

// Current user
router.get("/me", protect, getMe);

export default router;
