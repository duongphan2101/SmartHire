const express = require("express");
const router = express.Router();
const {
  getReviews,
  createReview,
  addComment,
  deleteReview,
  updateReview,
  updateComment,
} = require("../controllers/companyReviewController");

router.get("/", getReviews);
router.get("/:companyId", getReviews);
router.post("/", createReview);
router.post("/:reviewId/comments", addComment);
router.put("/:id", updateReview); 
router.put("/:reviewId/comments/:commentId", updateComment); 
router.delete("/:id", deleteReview);



module.exports = router;
