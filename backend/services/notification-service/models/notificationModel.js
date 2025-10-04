const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    receiverId: { type: String, required: true }, 
    type: { type: String, enum: ["APPLY", "SYSTEM"], default: "APPLY" },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
