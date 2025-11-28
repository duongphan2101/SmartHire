const express = require("express");
const router = express.Router();
const {
  applyJob,
  getApplicationsByJob,
  getApplicationsByUser, getApplicationsByJobAndHR, getApplicationsPendingByJobAndHR, 
  updateStatus, getNumApplicationByDepartment, updateStatusAndNote, updateStatus_reject, getNumApplicationByDepartmentAndUser
} = require("../controllers/applicationController");

// Apply job
router.post("/apply", applyJob);

// Get all applications of a job
router.get("/job/:jobId", getApplicationsByJob);

router.get("/num-application/:departmentId", getNumApplicationByDepartment);
router.get("/num-application/:departmentId/:userId", getNumApplicationByDepartmentAndUser);

// Get all applications of a user
router.post("/hr-candidatelist", getApplicationsByJobAndHR);
router.post("/hr-candidatependinglist", getApplicationsPendingByJobAndHR);
router.post("/update-reject", updateStatus_reject);

// Update status
router.put("/:id/status", updateStatus);
router.put("/:id/status-note", updateStatusAndNote);

module.exports = router;
