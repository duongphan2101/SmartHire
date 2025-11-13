const express = require("express");
const router = express.Router();
const Department = require("../models/Department");

const {
  getDepartments, getDepartmentbyId, findDepartmentByUserId,
  createDepartment, updateDepartment, deleteDepartment,
  searchDepartments, updateDepartmentStatus, createDepartmentInvite, joinDepartment
} = require("../controllers/departmentController");

router.get("/count", async (req, res) => {
  try {
    const total = await Department.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/getAll", getDepartments);
router.get("/user/:userId", findDepartmentByUserId);
router.get("/:id", getDepartmentbyId);
router.post('/create', createDepartment);
router.put('/update/:id', updateDepartment);
router.put('/status/:id', updateDepartmentStatus);
router.delete('/delete/:id', deleteDepartment);
router.get('/search', searchDepartments);
router.get("/:id/rating", async (req, res) => {
  try {
    const { id } = req.params;
    const { averageRating, totalReviews } = await calculateAverageRating(id);
    res.json({ averageRating, totalReviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/create-invite', createDepartmentInvite);
router.post('/join-department', joinDepartment);

module.exports = router;
