const Notification = require("../models/notificationModel");

exports.createNotification = async (req, res) => {
  try {
    const { receiverId, type, title, message, requestId } = req.body;

    if (!receiverId || !title || !message) {
      return res.status(400).json({ message: "Thiếu dữ liệu" });
    }

    const notification = await Notification.create({
      receiverId,
      type,
      title,
      message,
      requestId
    });

    if (req.io) {
      req.io.to(receiverId).emit("new-notification", notification);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy list notification của user
exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ receiverId: userId }).sort({
      createdAt: -1,
    });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đánh dấu đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
