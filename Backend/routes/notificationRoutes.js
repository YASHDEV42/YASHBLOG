const express = require("express");
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controllers/notificationController.js");
const auth = require("../middleware/auth.js");
router.post("/", auth, createNotification);
router.get("/", auth, getUserNotifications);
router.put("/:notificationId/read", auth, markNotificationAsRead);
router.put("/read-all", auth, markAllNotificationsAsRead);
router.delete("/:notificationId", auth, deleteNotification);
router.delete("/", auth, deleteAllNotifications);

module.exports = router;
