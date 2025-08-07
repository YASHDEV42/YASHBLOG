const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const InputValidator = require("../middleware/inputValidator.js");

const createTokens = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // 7 days for simplicity
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

const register = async (req, res, next) => {
  const { email, name, password } = req.body;

  // Validate email
  const emailValidation = InputValidator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ message: emailValidation.message });
  }

  // Validate name
  const nameValidation = InputValidator.validateName(name);
  if (!nameValidation.isValid) {
    return res.status(400).json({ message: nameValidation.message });
  }

  // Validate password
  const passwordValidation = InputValidator.validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({ message: passwordValidation.message });
  }

  try {
    const existingUser = await User.findOne({
      email: emailValidation.sanitized,
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      email: emailValidation.sanitized,
      name: nameValidation.sanitized,
      password: passwordValidation.sanitized,
    });
    await newUser.save();

    const token = createTokens(res, newUser._id);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email
  const emailValidation = InputValidator.validateEmail(email);
  if (!emailValidation.isValid) {
    return res.status(400).json({ message: emailValidation.message });
  }

  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    const user = await User.findOne({ email: emailValidation.sanitized });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = createTokens(res, user._id);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
const getUserProfile = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId)
      .populate("posts")
      .populate("likedPosts")
      .populate("comments")
      .populate("notifications")
      .populate("followers")
      .populate("following");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const plainUser = user.toObject();
    res.status(200).json(plainUser);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const userId = req.params.id;
  const { name, bio, profilePicture } = req.body;

  // Validate name if provided
  if (name !== undefined) {
    const nameValidation = InputValidator.validateName(name);
    if (!nameValidation.isValid) {
      return res.status(400).json({ message: nameValidation.message });
    }
  }

  // Validate bio if provided
  if (bio !== undefined) {
    const bioValidation = InputValidator.validateContent(bio);
    if (!bioValidation.isValid) {
      return res.status(400).json({ message: bioValidation.message });
    }
  }

  // Validate profile picture URL if provided
  if (profilePicture !== undefined) {
    const profilePictureValidation =
      InputValidator.validateProfilePictureUrl(profilePicture);
    if (!profilePictureValidation.isValid) {
      return res
        .status(400)
        .json({ message: profilePictureValidation.message });
    }
  }

  try {
    const updateData = {};
    if (name !== undefined)
      updateData.name = InputValidator.validateName(name).sanitized;
    if (bio !== undefined)
      updateData.bio = InputValidator.validateContent(bio).sanitized;
    if (profilePicture !== undefined)
      updateData.profilePicture =
        InputValidator.validateProfilePictureUrl(profilePicture).sanitized;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true })
      .populate("posts")
      .populate("likedPosts")
      .populate("comments")
      .populate("notifications")
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
const followUser = async (req, res, next) => {
  const { userId, followId } = req.body;
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(followId)
  ) {
    return res.status(400).json({ message: "Invalid user ID(s)" });
  }
  if (userId === followId) {
    return res.status(400).json({ message: "You cannot follow yourself" });
  }

  try {
    const [user, userToFollow] = await Promise.all([
      User.findById(userId),
      User.findById(followId),
    ]);

    if (!user || !userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.following.includes(followId)) {
      return res.status(400).json({ message: "Already following this user" });
    }

    await User.findByIdAndUpdate(userId, {
      $addToSet: { following: followId },
    });

    const updatedFollowUser = await User.findByIdAndUpdate(
      followId,
      { $addToSet: { followers: userId } },
      { new: true }
    );

    res.status(200).json({
      message: "Followed successfully",
      user: updatedFollowUser,
    });
  } catch (error) {
    console.error("Follow error:", error);
    next(error);
  }
};

const unfollowUser = async (req, res, next) => {
  const { userId, unfollowId } = req.body;
  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(unfollowId)
  ) {
    return res.status(400).json({ message: "Invalid user ID(s)" });
  }
  if (userId === unfollowId) {
    return res.status(400).json({ message: "You cannot unfollow yourself" });
  }

  try {
    const [user, userToUnfollow] = await Promise.all([
      User.findById(userId),
      User.findById(unfollowId),
    ]);

    if (!user || !userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.following.includes(unfollowId)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { following: unfollowId },
    });

    const updatedUnfollowUser = await User.findByIdAndUpdate(
      unfollowId,
      { $pull: { followers: userId } },
      { new: true }
    );

    res.status(200).json({
      message: "Unfollowed successfully",
      user: updatedUnfollowUser,
    });
  } catch (error) {
    console.error("Unfollow error:", error);
    next(error);
  }
};

const getFollowers = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("followers");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getFollowing = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("following");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.following);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserNotifications = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("notifications");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const markNotificationAsRead = async (req, res) => {
  const { userId, notificationId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const notificationIndex = user.notifications.indexOf(notificationId);
    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found" });
    }
    user.notifications[notificationIndex].isRead = true;
    await user.save();

    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
  });
  res.status(200).json({ message: "Logged out successfully" });
};
const getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    try {
      // Get user without populating related fields to avoid circular references
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error("getCurrentUser error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
};
const getLikedPosts = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("likedPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.likedPosts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};
