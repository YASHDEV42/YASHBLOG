const Notifications = require("../models/Notification");
const User = require("../models/User");

const createNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const notification = new Notifications({
      user: userId,
      type,
      message,
    });

    await notification.save();

    await User.findByIdAndUpdate(userId, {
      $push: { notifications: notification._id },
    });

    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
};
const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notifications = await Notifications.find({ user: userId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    next(error);
  }
};
const markNotificationAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const updatedNotification = await Notifications.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(updatedNotification);
  } catch (error) {
    next(error);
  }
};

const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Notifications.updateMany(
      { user: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};

const deleteNotification = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const notification = await Notifications.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { notifications: notification._id },
    });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    next(error);
  }
};
const deleteAllNotifications = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Notifications.deleteMany({ user: userId });

    await User.findByIdAndUpdate(userId, { $set: { notifications: [] } });

    res.status(200).json({ message: "All notifications deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
};
