const Report = require("../models/ReportModel");
const axios = require("axios"); 
const { HOSTS } = require("../host.js");

const createReportNotification = async (report) => {
  try {
    const adminId = process.env.ADMIN_ID; 
    if (!adminId) return;
//  console.log("Sending notification to admin:", adminId);
    await axios.post(`${HOSTS.notificationService}`, {
      receiverId: adminId,
      type: "REPORT",
      title: `Báo cáo: ${report.title}`,
      message: `Job "${report.jobTitle}" bị báo cáo với nội dung như sau: ${report.details.substring(0, 100)}`,
      requestId: report.jobId,
    });
  } catch (err) {
    console.error("Failed to send report notification:", err.message);
  }
};

exports.createReport = async (req, res) => {
  try {
    const { jobId, jobTitle, department, userId, title, details, contact } = req.body;

    const report = await Report.create({ jobId, jobTitle, department, userId, userContact: contact, title, details });

    await createReportNotification(report);

    res.status(201).json({ message: "Gửi báo cáo thành công" });
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