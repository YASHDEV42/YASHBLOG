const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const createTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  return token;
};
const register = async (req, res, next) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  if (!/^[a-zA-Z0-9]+$/.test(name)) {
    return res
      .status(400)
      .json({ message: "Name can only contain alphanumeric characters" });
  }
  if (name.length < 3 || name.length > 20) {
    return res
      .status(400)
      .json({ message: "Name must be between 3 and 20 characters long" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const newUser = new User({ email, name, password });
    await newUser.save();

    const token = createTokenAndSetCookie(res, newUser._id);

    res.status(201).json({ user: newUser });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "The password is too short!" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" });
    }
    const token = createTokenAndSetCookie(res, user._id);
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
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  const userId = req.params.id;
  const { name, bio, profilePicture } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { name, bio, profilePicture },
      { new: true }
    )
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
    sameSite: "Strict",
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
