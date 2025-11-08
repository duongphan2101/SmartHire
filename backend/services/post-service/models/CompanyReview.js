const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: String, default: "Người bình luận" },
  avatar: { type: String, default: "/default-avatar.png" },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const reviewSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: false },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, trim: true },
  content: { type: String, required: true },
  author: { type: String, default: "Người dùng ẩn danh" },
  avatar: { type: String, default: "/default-avatar.png" },
  date: { type: Date, default: Date.now },
  comments: [commentSchema],
});

module.exports = mongoose.model("CompanyReview", reviewSchema);
