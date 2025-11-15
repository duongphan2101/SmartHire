const Report = require("../models/ReportModel");
const axios = require("axios"); // để gọi notification service

// Gọi tạo notification (có thể là internal call hoặc HTTP nếu 2 service riêng)
const createReportNotification = async (report, adminId) => {
  try {
    await axios.post("http://localhost:5001/api/notifications", {
      // URL của notification service
      receiverId: adminId,
      type: "REPORT",
      title: `Báo cáo: ${report.title}`,
      message: `Job "${report.jobTitle}" bị báo cáo: ${report.details.substring(0, 100)}...`,
    });
  } catch (err) {
    console.error("Failed to send report notification:", err.message);
  }
};

exports.createReport = async (req, res) => {
  try {
    const { jobId, jobTitle, department, userId, title, details, contact } = req.body;

    if (!jobId || !userId || !title || !details) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const report = await Report.create({
      jobId,
      jobTitle,
      department,
      userId,
      userContact: contact,
      title,
      details,
    });

    // Gửi notification cho admin
    const ADMIN_ID = process.env.ADMIN_ID || "admin_123"; // hoặc lấy từ DB
    await createReportNotification(report, ADMIN_ID);

    res.status(201).json({ message: "Gửi báo cáo thành công", report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Không tìm thấy báo cáo" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};