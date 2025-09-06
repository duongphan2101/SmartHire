const Department = require("../models/Department");

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

module.exports = {
  getDepartments,
};
