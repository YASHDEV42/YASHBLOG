const express = require("express");
const router = express.Router();
const {
  createComment,
  getCommentsByPost,
  deleteComment,
  updateComment,
  getCommentById,
  getCommentsByUser,
  replayComment,
} = require("../controllers/commentController.js");
const auth = require("../middleware/auth.js");

// Comment creation with rate limiting
router.post("/", auth, createComment);
router.post("/reply/:commentId", auth, replayComment);

// Reading operations
router.get("/:postId", auth, getCommentsByPost);
router.get("/:id", auth, getCommentById);
router.get("/user/:userId", auth, getCommentsByUser);

// Modification operations
router.delete("/:id", auth, deleteComment);
router.put("/:id", auth, updateComment);

module.exports = router;
