// routes/postRoutes.js (ensure this file is imported in server.js)
import express from "express";
import { 
        viewPost, 
        getPost, 
        getPosts, 
        createPost, 
        likePost, 
        updatePost, 
        deletePost, 
        getMyPosts 
      } from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", getPosts);
router.get("/mine", protect, getMyPosts);
router.get("/:slug", getPost);

// VIEW endpoint (POST)
router.post("/:slug/view", viewPost); // viewPost imported from controller

// LIKE (protected)
router.post("/:slug/like", protect, likePost);

// update/delete
router.put("/:slug", protect, updatePost);
router.delete("/:slug", protect, deletePost);

export default router;
