const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

// Import security middleware with fallback
let createLimiter;
try {
  const securityMiddleware = require("../middleware/security.js");
  createLimiter = securityMiddleware.createLimiter;
} catch (error) {
  console.warn(
    "⚠️ Security middleware not available, using fallback for comments"
  );
  createLimiter = (req, res, next) => next();
}

const {
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment,
  getCommentById,
  getCommentsByUser,
  replayComment,
} = require("../controllers/commentController.js");

// Comment creation with rate limiting
router.post("/", auth, createLimiter, createComment);
router.post("/reply/:commentId", auth, createLimiter, replayComment);

// Reading operations
router.get("/:postId", auth, getCommentsByPost);
router.get("/single/:id", auth, getCommentById);
router.get("/user/:userId", auth, getCommentsByUser);

// Modification operations
router.delete("/:id", auth, deleteComment);
router.put("/:id", auth, updateComment);

module.exports = router;
