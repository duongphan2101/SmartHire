const express = require("express");
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/create", createNotification);
router.get("/receiver/:userId", getNotifications);
router.patch("/:id/read", markAsRead);

module.exports = router;
