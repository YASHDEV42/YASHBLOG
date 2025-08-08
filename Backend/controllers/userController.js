const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const InputValidator = require("../middleware/inputValidator.js");

/* ---------------------------- TOKEN HELPERS ---------------------------- */
const REFRESH_COOKIE_NAME = "refreshToken";

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // In dev over http, SameSite=None + secure will be rejected; use lax fallback
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/", // ensure clearing works
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const generateAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.ACCESS_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (userId) =>
  jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

const sendRefreshToken = (res, token) => {
  res.cookie(REFRESH_COOKIE_NAME, token, refreshCookieOptions());
};

const clearRefreshToken = (res) => {
  // Must match all attributes (path, sameSite) for reliable clearing
  const opts = refreshCookieOptions();
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...opts,
    maxAge: 0,
  });
};

// Utility to strip password consistently
const safeUser = (userDoc) => {
  if (!userDoc) return null;
  const u = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
  delete u.password;
  return u;
};

/* ------------------------------ REGISTER ------------------------------- */
const register = async (req, res, next) => {
  const { email, name, password } = req.body;

  try {
    // Validations
    const emailVal = InputValidator.validateEmail(email);
    if (!emailVal.isValid)
      return res.status(400).json({ message: emailVal.message });

    const nameVal = InputValidator.validateName(name);
    if (!nameVal.isValid)
      return res.status(400).json({ message: nameVal.message });

    const passVal = InputValidator.validatePassword(password);
    if (!passVal.isValid)
      return res.status(400).json({ message: passVal.message });

    // Check existing user
    const existingUser = await User.findOne({ email: emailVal.sanitized });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create new user
    const newUser = new User({
      email: emailVal.sanitized,
      name: nameVal.sanitized,
      password: passVal.sanitized,
    });
    await newUser.save();

    // Tokens
    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);
    sendRefreshToken(res, refreshToken);

    return res.status(201).json({ user: safeUser(newUser), accessToken });
  } catch (error) {
    next(error);
  }
};

/* -------------------------------- LOGIN --------------------------------- */
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const emailVal = InputValidator.validateEmail(email);
    if (!emailVal.isValid)
      return res.status(400).json({ message: emailVal.message });

    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required" });
    }

    const user = await User.findOne({ email: emailVal.sanitized });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    sendRefreshToken(res, refreshToken);

    return res.status(200).json({ user: safeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

/* ------------------------------ LOGOUT --------------------------------- */
const logout = (req, res) => {
  clearRefreshToken(res);
  return res.status(200).json({ message: "Logged out successfully" });
};

/* ----------------------- REFRESH ACCESS TOKEN -------------------------- */
const refreshTokenHandler = (req, res) => {
  const token = req.cookies[REFRESH_COOKIE_NAME];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.REFRESH_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    // Rotate refresh token
    const newRefreshToken = generateRefreshToken(decoded.userId);
    sendRefreshToken(res, newRefreshToken);

    const accessToken = generateAccessToken(decoded.userId);
    return res.json({ accessToken });
  });
};

/* -------------------------- GET CURRENT USER --------------------------- */
const getCurrentUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_SECRET, async (err, decoded) => {
      if (err) return res.sendStatus(403);

      const user = await User.findById(decoded.userId).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ user: safeUser(user) });
    });
  } catch (error) {
    next(error);
  }
};

/* --------------------------- GET USER PROFILE -------------------------- */
const getUserProfile = async (req, res, next) => {
  try {
    // support either /user/profile (current user) or /user/:id/profile
    const targetId = req.params.id || req.user?.id || req.user?._id;
    if (!targetId) return res.status(400).json({ message: "User id missing" });

    const user = await User.findById(targetId)
      .select("-password")
      .populate("posts", "title createdAt slug")
      .populate("followers", "name")
      .populate("following", "name");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/* -------------------------- UPDATE USER PROFILE ------------------------ */
const updateUserProfile = async (req, res, next) => {
  const { name, bio, profilePicture } = req.body;
  // fallback to auth user if no param id
  const userId = req.params.id || req.user?.id || req.user?._id;

  try {
    if (!userId) return res.status(400).json({ message: "User id missing" });
    const updateData = {};

    if (name !== undefined) {
      const val = InputValidator.validateName(name);
      if (!val.isValid) return res.status(400).json({ message: val.message });
      updateData.name = val.sanitized;
    }

    if (bio !== undefined) {
      const val = InputValidator.validateContent(bio);
      if (!val.isValid) return res.status(400).json({ message: val.message });
      updateData.bio = val.sanitized;
    }

    if (profilePicture !== undefined) {
      const val = InputValidator.validateProfilePictureUrl(profilePicture);
      if (!val.isValid) return res.status(400).json({ message: val.message });
      updateData.profilePicture = val.sanitized;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password")
      .populate("posts", "title createdAt slug");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(safeUser(user));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  refreshTokenHandler,
};
