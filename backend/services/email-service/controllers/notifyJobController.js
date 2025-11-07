const nodemailer = require("nodemailer");

// Khởi tạo transporter (Giữ nguyên)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Kiểm tra kết nối (Giữ nguyên)
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter error:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

/**
 * Gửi email thông báo cho user khi có công việc mới phù hợp.
 */
exports.sendJobSuggestionEmail = async (req, res) => {
  try {
    const { hr, job, candidates } = req.body;

    // --- 1. Validation ---
    if (!hr || !hr.email || !hr.fullname) {
      return res.status(400).json({
        message: "Thiếu thông tin HR (hr, email, fullname).",
      });
    }

    if (!job || !job.title) {
      return res.status(400).json({
        message: "Thiếu thông tin công việc (job.title).",
      });
    }

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return res.status(400).json({
        message: "Không có danh sách ứng viên phù hợp để gửi.",
      });
    }

    // --- 2. Gửi email cho từng ứng viên ---
    for (const candidate of candidates) {
      if (!candidate.email) continue;

      const subject = `SmartHire: Gợi ý công việc mới - ${job.title}`;
      const htmlTemplate = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 95%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 22px;">SmartHire - Việc làm phù hợp với bạn</h1>
          </div>

          <div style="padding: 25px;">
            <h2 style="color: #333;">Xin chào ${candidate.fullname},</h2>
            <p>SmartHire vừa tìm thấy một công việc có thể phù hợp với hồ sơ của bạn:</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; border: 1px solid #eee;">
              <h3 style="margin: 0 0 10px; color: #059669;">${job.title}</h3>
              <p><strong>Công ty:</strong> ${hr.companyName || "Đang cập nhật"}</p>
              <p><strong>Địa điểm:</strong> ${job.location || "Đang cập nhật"}</p>
              <p><strong>Mức lương:</strong> ${job.salary || "Thương lượng"}</p>
              <p><strong>Điểm phù hợp:</strong> ${candidate.finalScore ?? "N/A"}%</p>

              <a href="${process.env.CLIENT_URL}/jobdetail/${job._id || ""}"
                target="_blank"
                style="background-color: #059669; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; font-weight: bold;">
                Xem chi tiết & Ứng tuyển
              </a>
            </div>

            <p style="margin-top: 25px;">Chúc bạn sớm tìm được công việc phù hợp! 💼</p>
            <p>Trân trọng,<br>Đội ngũ SmartHire</p>
          </div>
        </div>
      `;

      const textFallback = `
        Xin chào ${candidate.fullname},
        SmartHire vừa tìm thấy một công việc phù hợp:
        - Vị trí: ${job.title}
        - Công ty: ${hr.companyName || "Đang cập nhật"}
        - Mức lương: ${job.salary || "Thương lượng"}
        - Link: ${process.env.CLIENT_URL}/jobdetail/${job._id || ""}
      `;

      const mailOptions = {
        from: `SmartHire <${process.env.EMAIL_USER}>`,
        to: candidate.email,
        subject,
        text: textFallback,
        html: htmlTemplate,
      };

      console.log("📧 Gửi email job suggestion đến:", candidate.email);
      await transporter.sendMail(mailOptions);
    }

    // --- 3. Phản hồi thành công ---
    res.json({
      message: `Đã gửi email gợi ý công việc "${job.title}" cho ${candidates.length} ứng viên.`,
    });
  } catch (err) {
    console.error("❌ Email error:", err.message);
    res.status(500).json({
      message: "Gửi email gợi ý thất bại",
      error: err.message,
    });
  }
};
