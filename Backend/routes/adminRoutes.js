import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import {
  getAllUsers,
  deleteUser,
  getAllPosts,
  deletePostByAdmin,
  getAnalytics
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);

router.get("/posts", protect, isAdmin, getAllPosts);
router.delete("/posts/:slug", protect, isAdmin, deletePostByAdmin);

router.get("/analytics", protect, isAdmin, getAnalytics);

export default router;
