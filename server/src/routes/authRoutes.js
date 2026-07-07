import express from "express";
import {
  signupUser,
  loginUser,
  signupAdmin,
  loginAdmin,
  getMe,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Normal user
router.post("/signup", signupUser);
router.post("/login", loginUser);

// Admin user
// Creating an admin requires an existing admin (seed the first one via
// `npm run seed:admin`). Admin login stays public.
router.post("/admin/signup", protect, authorize("admin"), signupAdmin);
router.post("/admin/login", loginAdmin);

// Current user
router.get("/me", protect, getMe);

export default router;
