const express = require("express");
const router = express.Router();
const {
  getReviews,
  createReview,
  addComment,
  deleteReview,
} = require("../controllers/companyReviewController");

// Lấy danh sách review (tất cả hoặc theo companyId)
router.get("/", getReviews);
router.get("/:companyId", getReviews);

// Tạo review mới
router.post("/", createReview);

// Thêm comment
router.post("/:reviewId/comments", addComment);

// Xoá review
router.delete("/:id", deleteReview);



module.exports = router;
