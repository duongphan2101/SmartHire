const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CV", cvSchema);
