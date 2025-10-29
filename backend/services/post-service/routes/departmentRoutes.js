const express = require("express");
const router = express.Router();
const Department = require("../models/Department");
const {
  getDepartments,
  getDepartmentbyId,
  findDepartmentByUserId,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
} = require("../controllers/departmentController");

router.get("/getAll", getDepartments);
router.get("/:id", getDepartmentbyId);
router.get("/user/:userId", findDepartmentByUserId);
router.post('/create', createDepartment);
router.put('/update/:id', updateDepartment);
router.delete('/delete/:id', deleteDepartment);
router.get('/search', searchDepartments);

module.exports = router;
