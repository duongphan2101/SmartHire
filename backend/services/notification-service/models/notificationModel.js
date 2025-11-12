const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    receiverId: { type: String, required: true },
    type: { type: String, enum: ["APPLY", "SYSTEM", "INFO", "INTERVIEW_INVITE", "CHAT_REQUEST"], default: "APPLY" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    requestId: { type: String, require: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
