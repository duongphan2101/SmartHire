const mongoose = require("mongoose");

const ChatRequestSchema = new mongoose.Schema(
  {
    hrId: {
      type: String,
      required: true,
    },
    candidateId: {
      type: String,
      required: true,
    },
    jobId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRequest", ChatRequestSchema);
