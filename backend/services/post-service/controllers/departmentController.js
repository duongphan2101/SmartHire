const Department = require("../models/Department");
const mongoose = require("mongoose");
// @desc    Get all departments
// @route   GET /api/department
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Find department by userId (HR)
// @route   GET /api/department/user/:userId
const findDepartmentByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const department = await Department.findOne({
      employees: userId.toString()
    });


    if (!department) {
      return res.status(404).json({ message: "Department not found for this user" });
    }

    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDepartments,
  findDepartmentByUserId,
};
