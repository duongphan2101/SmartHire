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
    const department = await Department.findOne({ employees: userId.toString() });
    if (!department) {
      return res.status(404).json({ message: "Department not found for this user" });
    }
    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// thêm
const createDepartment = async (req, res) => {
  try {
    const department = new Department(req.body);
    const saved = await department.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật 
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Department.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa 
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tìm kiếm
const searchDepartments = async (req, res) => {
  try {
    const { keyword } = req.query;
    const departments = await Department.find({
      name: { $regex: keyword, $options: "i" }
    });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDepartments,
  findDepartmentByUserId,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments
};