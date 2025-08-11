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

// Create and reply
router.post("/", auth, createComment);
router.post("/reply/:commentId", auth, replayComment);

// Read
router.get("/post/:postId", getCommentsByPost);
router.get("/:id", getCommentById);
router.get("/user/me", auth, getCommentsByUser);

// Update/Delete
router.put("/:id", auth, updateComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
