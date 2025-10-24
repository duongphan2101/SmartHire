const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const {
  getDepartments,
  findDepartmentByUserId,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
  updateDepartmentStatus
} = require("../controllers/departmentController");

router.get("/getAll", getDepartments);
router.get("/user/:userId", findDepartmentByUserId);
router.post('/create', createDepartment);
router.put('/update/:id', updateDepartment);
router.put('/status/:id', updateDepartmentStatus);
router.delete('/delete/:id', deleteDepartment);
router.get('/search', searchDepartments);

module.exports = router;
