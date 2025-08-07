const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
let createLimiter, apiLimiter;
try {
  const securityMiddleware = require("../middleware/security.js");
  createLimiter = securityMiddleware.createLimiter;
  apiLimiter = securityMiddleware.apiLimiter;
} catch (error) {
  console.warn(
    "⚠️ Security middleware not available, using fallback for posts"
  );
  createLimiter = (req, res, next) => next();
  apiLimiter = (req, res, next) => next();
}

// Import post controller with error handling
let postController;
try {
  postController = require("../controllers/postController.js");
} catch (error) {
  console.error("❌ Error loading post controller:", error.message);
  // Create fallback controller methods
  const fallbackHandler = (req, res) => {
    res.status(503).json({
      error: "Post service unavailable",
      message: "Please try again later",
    });
  };

  postController = {
    createPost: fallbackHandler,
    getPost: fallbackHandler,
    getAllPosts: fallbackHandler,
    updatePost: fallbackHandler,
    deletePost: fallbackHandler,
    togglePublished: fallbackHandler,
    toggleLike: fallbackHandler,
    getPostByAuthor: fallbackHandler,
  };
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
} = postController;

// Routes
router.post("/", auth, createLimiter, createPost);
router.get("/", apiLimiter, getAllPosts);
router.get("/author", auth, apiLimiter, getPostByAuthor);
router.get("/:slug", apiLimiter, getPost);
router.put("/:slug", auth, updatePost);
router.delete("/:slug", auth, deletePost);
router.patch("/:slug/publish", auth, togglePublished);
router.put("/:slug/like", auth, toggleLike);

module.exports = router;
