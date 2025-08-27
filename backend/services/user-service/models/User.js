const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    dob: { type: Date },
    email: { type: String, required: true, unique: true, lowercase: true },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "hr", "admin"], default: "user" },
    phone: { type: String, default: null },
    liked: { type: [String], default: [] },      // danh sách id job/user đã like
    applyted: { type: [String], default: [] },   // danh sách job đã apply
    cv: [{ type: mongoose.Schema.Types.ObjectId, ref: "CV" }] // list CV id
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
