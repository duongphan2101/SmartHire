const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    jobTitle: { type: String },
    department: { type: String },
    userId: { type: String, required: true },
    userContact: { type: String },
    title: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
