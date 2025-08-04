const express = require("express");
const router = express.Router();
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
const auth = require("../middleware/auth.js");

router.post("/", auth, createPost);
router.get("/:slug", auth, getPost);
router.get("/", auth, getAllPosts);
router.put("/:slug", auth, updatePost);
router.delete("/:slug", auth, deletePost);
router.put("/:slug/publish", auth, togglePublished);
router.put("/:slug/like", auth, toggleLike);
router.get("/author", auth, getPostByAuthor);

module.exports = router;
