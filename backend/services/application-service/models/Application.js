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
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CV"
    },

    // Snapshot thông tin lúc apply
    jobSnapshot: {
      title: String,
      salary: String,
      jobType: String,
      jobLevel: String,
      address: String,
      location: String,
    },
    userSnapshot: {
      _id: String,
      fullname: String,
      email: String,
      avatar: String,
    },
    cvSnapshot: {
      fileUrls: String
    },

    coverLetter: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected", "contacted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Không cho 1 user apply 1 job nhiều lần
ApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);
