// models/Interview.js
import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "completed"],
      default: "pending",
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", InterviewSchema);
