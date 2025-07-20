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
router.post("/", auth, createComment);
router.get("/post/:postId", auth, getCommentsByPost);
router.delete("/:id", auth, deleteComment);

router.put("/:id", auth, updateComment);
router.get("/:id", auth, getCommentById);
router.get("/user/:userId", auth, getCommentsByUser);
router.post("/reply/:commentId", auth, replayComment);

module.exports = router;
