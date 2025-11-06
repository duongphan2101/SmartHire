const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    dob: { type: Date },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "hr", "admin"], default: "user" },
    phone: { type: String, default: null },
    liked: { type: [String], default: [] },
    applyted: { type: [String], default: [] },
    cv: [{ type: mongoose.Schema.Types.ObjectId, ref: "CV" }],
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
