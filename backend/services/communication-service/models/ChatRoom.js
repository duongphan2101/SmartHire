const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "file", "system"],
    default: "text",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatRoomSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
    },
    members: [
      {
        type: String,
        required: true,
      },
    ],
    chats: [ChatSchema],
    lastMessage: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);