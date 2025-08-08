const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  refreshTokenHandler,
} = require("../controllers/userController.js");

const auth = require("../middleware/auth.js");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/refresh", refreshTokenHandler);
router.get("/current", auth, getCurrentUser);

// Current user profile (already authenticated)
router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);

// Optional explicit user id profile access (controlled by auth/authorization)
router.get("/:id/profile", auth, getUserProfile);
router.put("/:id/profile", auth, updateUserProfile);

module.exports = router;
