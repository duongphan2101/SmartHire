// routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
} = require("../controllers/interviewControllers.js");

// Định tuyến CRUD
router.post("/", createInterview); // Create
router.get("/", getAllInterviews); // Read (All)
router.get("/:id", getInterviewById); // Read (One)
router.put("/:id", updateInterview); // Update
router.delete("/:id", deleteInterview); // Delete

module.exports = router;