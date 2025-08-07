const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

// Import security middleware with fallback
let createLimiter, apiLimiter;
try {
  const securityMiddleware = require("../middleware/security.js");
  createLimiter = securityMiddleware.createLimiter;
  apiLimiter = securityMiddleware.apiLimiter;
} catch (error) {
  console.warn("⚠️ Security middleware not available, using fallback");
  createLimiter = (req, res, next) => next();
  apiLimiter = (req, res, next) => next();
}

const {
  createPost,
  getPost,
  getAllPosts,
  updatePost,
  deletePost,
  togglePublished,
  toggleLike,
  getPostByAuthor,
} = require("../controllers/postController.js");

// Create post with rate limiting
router.post("/", auth, createLimiter, createPost);

// Get all posts
router.get("/", apiLimiter, getAllPosts);

// Get posts by author
router.get("/author", auth, apiLimiter, getPostByAuthor);

// Get single post by slug
router.get("/:slug", apiLimiter, getPost);

// Update post
router.put("/:slug", auth, updatePost);

// Delete post
router.delete("/:slug", auth, deletePost);

// Toggle published status
router.patch("/:slug/publish", auth, togglePublished);

// Toggle like
router.put("/:slug/like", auth, toggleLike);

module.exports = router;
