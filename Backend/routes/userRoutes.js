const express = require("express");
const router = express.Router();
const { authLimiter } = require("../middleware/security.js");

const {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserPosts,
  getUserNotifications,
  markNotificationAsRead,
  logout,
  getCurrentUser,
  getLikedPosts,
} = require("../controllers/userController.js");
const auth = require("../middleware/auth.js");

// Authentication routes with stricter rate limiting
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Protected routes
router.get("/profile/:id", auth, getUserProfile);
router.put("/profile/:id", auth, updateUserProfile);
router.post("/follow", auth, followUser);
router.post("/unfollow", auth, unfollowUser);
router.get("/followers/:id", auth, getFollowers);
router.get("/following/:id", auth, getFollowing);
router.get("/posts/:id", auth, getUserPosts);
router.get("/notifications/:id", auth, getUserNotifications);
router.post("/notifications/read", auth, markNotificationAsRead);
router.post("/logout", logout);
router.get("/current", auth, getCurrentUser);
router.get("/liked-posts/:id", auth, getLikedPosts);

module.exports = router;
