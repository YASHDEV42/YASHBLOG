const express = require("express");
const router = express.Router();

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

router.post("/register", register);
router.post("/login", login);
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
