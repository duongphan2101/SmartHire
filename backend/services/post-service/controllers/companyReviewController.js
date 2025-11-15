// controllers/companyReviewController.js
const CompanyReview = require("../models/CompanyReview");
const Department = require("../models/Department"); // <-- thêm
const axios = require("axios");
const { HOSTS } = require("../../host");

// Helper: tính trung bình và update Department
const calculateAverageRating = async (companyId) => {
  if (!companyId) {
    return { averageRating: 0, totalReviews: 0 };
  }

  // 1) aggregate để tính trung bình và count
  const agg = await CompanyReview.aggregate([
    { $match: { companyId: require('mongoose').Types.ObjectId(companyId) } },
    {
      $group: {
        _id: "$companyId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  let averageRating = 0;
  let totalReviews = 0;

  if (agg.length > 0) {
    averageRating = Number((agg[0].averageRating || 0).toFixed(1)); // 1 decimal like frontend
    totalReviews = agg[0].totalReviews || 0;
  }

  // 2) update Department document (nếu tồn tại)
  try {
    await Department.findByIdAndUpdate(
      companyId,
      { averageRating, totalReviews },
      { new: true, runValidators: true }
    );
  } catch (err) {
    // không dừng flow nếu không cập nhật được department — log lỗi để debug
    console.error("Failed to update Department rating:", err.message);
  }

  return { averageRating, totalReviews };
};

// --- existing getReviews, createReview, addComment, updateReview, updateComment, deleteReview ---
// We'll only show modified create/update/delete to include calculateAverageRating calls

// Lấy danh sách review
const getReviews = async (req, res) => {
  try {
    const { companyId } = req.params;
    const reviews = companyId
      ? await CompanyReview.find({ companyId }).sort({ date: -1 })
      : await CompanyReview.find().sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createReview = async (req, res) => {
  try {
    const { companyId, rating, title, content, userId, fullname, avatar } =
      req.body || {};

    let authorName = "Người dùng ẩn danh";

    if (fullname) authorName = fullname;
    else if (userId) {
      try {
        const response = await axios.get(
          `${HOSTS.userService}/users/${userId}`
        );
        authorName = response.data?.fullname || authorName;
      } catch (err) {
        console.error("Lỗi gọi user-service:", err.message);
      }
    }

    const newReview = new CompanyReview({
      companyId,
      rating,
      title,
      content,
      author: authorName,
      avatar: avatar || "/default-avatar.png",
      userId,
    });

    await newReview.save();

    // Update department rating after saved
    const ratingResult = await calculateAverageRating(companyId);

    // Trả về review kèm rating mới (nếu frontend cần)
    res.status(201).json({ review: newReview, rating: ratingResult });
  } catch (err) {
    console.error("Tạo review lỗi:", err);
    res.status(400).json({ message: err.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, rating, userId: currentUserId } = req.body;

    const review = await CompanyReview.findById(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy" });

    // Kiểm tra quyền
    if (review.userId !== currentUserId) {
      return res.status(403).json({ message: "Không có quyền" });
    }

    // Kiểm tra thời gian (48h)
    const hoursDiff = (Date.now() - new Date(review.date)) / (1000 * 60 * 60);
    if (hoursDiff > 48) {
      return res
        .status(403)
        .json({ message: "Đã quá thời gian chỉnh sửa (48 giờ)" });
    }

    // Cập nhật
    if (title !== undefined) review.title = title;
    if (content !== undefined) review.content = content;
    if (rating !== undefined) review.rating = rating;
    review.editedAt = new Date();

    await review.save();

    // Recompute rating for company
    const ratingResult = await calculateAverageRating(review.companyId);

    res.json({ review, rating: ratingResult });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    // find review first to get companyId
    const review = await CompanyReview.findById(id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const companyId = review.companyId;
    await CompanyReview.findByIdAndDelete(id);

    // Recompute rating for company
    await calculateAverageRating(companyId);

    res.json({ message: "Xoá review thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add comment / updateComment stay the same - they don't affect rating
const addComment = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text, fullname, userId, avatar } = req.body || {};

    const review = await CompanyReview.findById(reviewId);
    if (!review)
      return res.status(404).json({ message: "Review không tồn tại" });

    let authorName = "Người bình luận";

    if (fullname) authorName = fullname;
    else if (userId) {
      try {
        const response = await axios.get(
          `${HOSTS.userService}/users/${userId}`
        );
        authorName = response.data?.fullname || authorName;
      } catch (err) {
        console.error("Lỗi gọi user-service:", err.message);
      }
    }

    review.comments.push({
      author: authorName,
      avatar: avatar || "/default-avatar.png",
      text,
      userId,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error("Thêm comment lỗi:", err);
    res.status(400).json({ message: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const { reviewId, commentId } = req.params;
    const { text, userId: currentUserId } = req.body;

    const review = await CompanyReview.findById(reviewId);
    if (!review)
      return res.status(404).json({ message: "Review không tồn tại" });

    const comment = review.comments.id(commentId);
    if (!comment)
      return res.status(404).json({ message: "Comment không tồn tại" });

    if (comment.userId !== currentUserId) {
      return res.status(403).json({ message: "Không có quyền" });
    }

    const hoursDiff = (Date.now() - new Date(comment.date)) / (1000 * 60 * 60);
    if (hoursDiff > 48) {
      return res.status(403).json({ message: "Đã quá thời gian chỉnh sửa" });
    }

    comment.text = text;
    comment.editedAt = new Date();

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  addComment,
  updateReview,
  updateComment,
  deleteReview,
  calculateAverageRating, // export so department router can call it (used by /:id/rating)
};
