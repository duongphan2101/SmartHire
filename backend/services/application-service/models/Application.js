const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    resumeId: {
      type: String,
      required: true,
      ref: "CV"
    },
    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Không cho 1 user apply 1 job nhiều lần
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
