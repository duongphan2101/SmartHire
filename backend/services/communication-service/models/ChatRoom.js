// models/ChatRoom.js
import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    chats: [ChatSchema], // danh sách tin nhắn lưu trực tiếp
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

export default mongoose.model("ChatRoom", ChatRoomSchema);
