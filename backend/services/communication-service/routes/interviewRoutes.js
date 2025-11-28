// routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const {
  createInterview,
  getAllInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
  getInterviewByHrId
} = require("../controllers/interviewControllers.js");

// Định tuyến CRUD
router.post("/create", createInterview); // Create
router.get("/hr/:hrId", getInterviewByHrId); // Read (By HR ID)
router.get("/", getAllInterviews); // Read (All)
router.get("/:id", getInterviewById); // Read (One)
router.put("/:id", updateInterview); // Update
router.delete("/:id", deleteInterview); // Delete

module.exports = router;