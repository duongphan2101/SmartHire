const express = require("express");
const router = express.Router();
const {
  applyJob,
  getApplicationsByJob,
  getApplicationsByUser,
  updateStatus, getNumApplicationByDepartment, updateStatusAndNote, updateStatus_reject
} = require("../controllers/applicationController");

// Apply job
router.post("/", applyJob);

// Get all applications of a job
router.get("/job/:jobId", getApplicationsByJob);

router.get("/num-application/:departmentId", getNumApplicationByDepartment);
router.get("/num-application/:departmentId/:userId", getNumApplicationByDepartment);

// Get all applications of a user
router.get("/user/:userId", getApplicationsByUser);
router.post("/update-reject", updateStatus_reject);

// Update status
router.put("/:id/status", updateStatus);
router.put("/:id/status-note", updateStatusAndNote);

module.exports = router;
