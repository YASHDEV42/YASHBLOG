const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  refreshToken,
} = require("../controllers/userController.js");

const auth = require("../middleware/auth.js");
const { authLimiter, apiLimiter } = require("../middleware/security.js");

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", refreshToken);

router.get("/profile", auth, apiLimiter, getProfile);
router.put("/profile", auth, apiLimiter, updateProfile);
router.post("/logout", auth, logout);

module.exports = router;
