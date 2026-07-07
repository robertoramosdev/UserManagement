import express from "express";
import {
  signupUser,
  loginUser,
  signupAdmin,
  loginAdmin,
  getMe,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { signupRules, loginRules } from "../validators/authValidators.js";

const router = express.Router();

// Rate-limit only the credential endpoints (not /me, which the client polls
// on every page load to restore the session).

// Normal user
router.post("/signup", authLimiter, signupRules, validate, signupUser);
router.post("/login", authLimiter, loginRules, validate, loginUser);

// Admin user
// Creating an admin requires an existing admin (seed the first one via
// `npm run seed:admin`). Admin login stays public.
router.post(
  "/admin/signup",
  protect,
  authorize("admin"),
  signupRules,
  validate,
  signupAdmin
);
router.post("/admin/login", authLimiter, loginRules, validate, loginAdmin);

// Current user
router.get("/me", protect, getMe);

export default router;
