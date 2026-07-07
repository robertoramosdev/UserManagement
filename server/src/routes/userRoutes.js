import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // all routes below require authentication

router.get("/", authorize("admin"), getUsers);
router.get("/:id", getUser); // admin or owner (checked in controller)
router.put("/:id", updateUser); // admin or owner
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
