const Department = require("../models/Department");
const DepartmentInvite = require("../models/DepartmentInvite");
const mongoose = require("mongoose");

const createDepartmentInvite = async (req, res) => {
  try {
    const { departmentId, createdBy } = req.body;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const invite = new DepartmentInvite({ code, departmentId, createdBy });
    await invite.save();

    res.status(201).json({
      message: "Tạo mã mời thành công",
      code,
      expiresAt: invite.expiresAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const joinDepartment = async (req, res) => {
  try {
    const { code, userId } = req.body;

    const invite = await DepartmentInvite.findOne({ code });
    if (!invite)
      return res.status(400).json({ message: "Mã mời không hợp lệ" });

    if (invite.status !== "active" || invite.expiresAt < Date.now())
      return res
        .status(400)
        .json({ message: "Mã mời đã hết hạn hoặc bị vô hiệu hóa" });

    if (invite.usedBy.includes(userId))
      return res.status(400).json({ message: "Bạn đã dùng mã này rồi" });

    if (invite.usedBy.length >= invite.maxUses)
      return res.status(400).json({ message: "Mã mời đã đạt giới hạn" });

    const department = await Department.findById(invite.departmentId);
    if (!department)
      return res.status(404).json({ message: "Không tìm thấy phòng ban" });

    if (department.employees.includes(userId))
      return res.status(400).json({ message: "Bạn đã thuộc phòng ban này" });

    department.employees.push(userId);
    await department.save();

    invite.usedBy.push(userId);
    await invite.save();

    res.json({
      message: "Gia nhập phòng ban thành công",
      departmentId: invite.departmentId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

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

// @desc    Get all departments
// @route   GET /api/department
const getDepartmentbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    res.json(department);
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
      employees: userId.toString(),
    });

    if (!department) {
      return res.json({ message: "User chưa thuộc công ty nào" });
    }

    res.json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// thêm
const createDepartment = async (req, res) => {
  try {
    const department = new Department({
      ...req.body,
      status: "Pending",
    });

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
    const updated = await Department.findByIdAndUpdate(id, req.body, {
      new: true,
    });
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
      name: { $regex: keyword, $options: "i" },
    });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDepartmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["Pending", "Active", "Suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Department.findByIdAndUpdate(
      id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({
      message: `Department status updated to ${status}`,
      department: updated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getTotalDepartments = async (req, res) => {
  try {
    const total = await Department.countDocuments();
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDepartments,
  getDepartmentbyId,
  findDepartmentByUserId,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  searchDepartments,
  updateDepartmentStatus,
  joinDepartment,
  createDepartmentInvite,
  getTotalDepartments,
};
