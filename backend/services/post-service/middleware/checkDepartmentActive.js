const Department = require("../models/Department");

const checkDepartmentActive = async (req, res, next) => {
  try {
    const { departmentId } = req.body;

    if (!departmentId)
      return res.status(400).json({ message: "Thiếu departmentId" });

    const department = await Department.findById(departmentId);
    if (!department)
      return res.status(404).json({ message: "Không tìm thấy công ty" });

    if (department.status !== "Active") {
      return res.status(403).json({
        message: "Công ty chưa được duyệt. Bạn không thể thực hiện thao tác này.",
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = checkDepartmentActive;
