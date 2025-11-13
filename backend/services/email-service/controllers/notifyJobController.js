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

/**
 * Gửi email thông báo cho ứng viên khi HR gửi lời mời trao đổi.
 */
exports.sendChatRequestEmail = async (req, res) => {
  try {
    const { hr, job, candidate, message } = req.body;

    // console.log("HR: ", hr);
    // console.log("JOB: ", job);
    // console.log("Candidate: ", candidate);
    // console.log("MESSAGE: ", message);

    // --- 1. Validation ---
    if (!hr || !hr.email || !hr.fullname || !hr.companyName) {
      return res.status(400).json({
        message: "Thiếu thông tin HR (hr, email, fullname, companyName).",
      });
    }

    if (!job || !job.title) {
      return res.status(400).json({
        message: "Thiếu thông tin công việc (job.title).",
      });
    }

    if (!candidate || !candidate.email || !candidate.fullname) {
      return res.status(400).json({
        message: "Thiếu thông tin ứng viên (candidate, email, fullname).",
      });
    }

    // --- 2. Xây dựng nội dung Email ---
    const subject = `SmartHire: Bạn có lời mời trao đổi cho vị trí ${job.title}!`;
    const defaultMessage =
      "Chúng tôi rất ấn tượng với hồ sơ của bạn và mong muốn được trao đổi thêm về cơ hội này.";

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 95%; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">SmartHire - Bạn có lời mời trao đổi!</h1>
        </div>

        <div style="padding: 25px;">
          <h2 style="color: #333;">Xin chào ${candidate.fullname},</h2>
          <p>Tin vui! <strong>${hr.fullname}</strong> từ công ty <strong>${hr.companyName}</strong> đã xem hồ sơ của bạn và muốn mời bạn trao đổi về vị trí:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px 20px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 20px;">
            <h3 style="margin: 0 0 5px; color: #059669;">${job.title}</h3>
            <p style="margin: 0;"><strong>Công ty:</strong> ${hr.companyName}</p>
          </div>

          <div style="background-color: #fdfdfd; padding: 20px; border-radius: 5px; border: 1px solid #eee; margin-bottom: 25px; border-left: 4px solid #059669;">
            <p style="margin: 0 0 10px; font-weight: bold;">Lời nhắn từ ${hr.fullname}:</p>
            <p style="margin: 0; font-style: italic;">
              "${message || defaultMessage}"
            </p>
          </div>

          <a href="${process.env.CLIENT_URL}/jobdetail/${job._id || ""}"
            target="_blank"
            style="background-color: #059669; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; font-weight: bold;">
            Xem chi tiết & Ứng tuyển
          </a>

          <p>Vui lòng đăng nhập vào SmartHire để xem chi tiết và phản hồi lại nhà tuyển dụng nhé.</p>

          <p style="margin-top: 25px;">Chúc bạn có buổi trao đổi thành công! 🤝</p>
          <p>Trân trọng,<br>Đội ngũ SmartHire</p>
        </div>
      </div>
    `;

    const textFallback = `
      Xin chào ${candidate.fullname},
      Tin vui! ${hr.fullname} từ ${hr.companyName} đã gửi bạn lời mời trao đổi cho vị trí ${job.title}.
      
      Lời nhắn từ HR: "${message || defaultMessage}"
      
      Vui lòng đăng nhập vào SmartHire để phản hồi
      Chúc bạn có buổi trao đổi thành công!
    `;

    const mailOptions = {
      from: `SmartHire <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      subject,
      text: textFallback,
      html: htmlTemplate,
    };

    // --- 3. Gửi email ---
    console.log(`📧 Gửi email mời trao đổi đến: ${candidate.email} từ ${hr.email}`);
    await transporter.sendMail(mailOptions);

    // --- 4. Phản hồi thành công ---
    res.json({
      message: `Đã gửi lời mời trao đổi cho ứng viên ${candidate.fullname} thành công.`,
    });

  } catch (err) {
    console.error("❌ Email error:", err.message);
    res.status(500).json({
      message: "Gửi email mời trao đổi thất bại",
      error: err.message,
    });
  }
};

/**
 * Gửi email thông báo kết quả phỏng vấn (Đậu hoặc Rớt).
 */
exports.sendInterviewResultEmail = async (req, res) => {
  try {
    const { hr, job, candidate, result, feedback } = req.body; 
    
    // console.log("-----------------------------------------------");
    // console.log("HR: ", hr);
    // console.log("JOB: ", job);
    // console.log("CANDIDATE: ", candidate);
    // console.log("RESULT: ", result);
    // console.log("FEEDBACK: ", feedback);
    // console.log("-----------------------------------------------");

    // --- 1. Validation ---
    if (!hr || !hr.companyName) {
      return res.status(400).json({ message: "Thiếu thông tin công ty (hr.companyName)." });
    }
    if (!job || !job.title) {
      return res.status(400).json({ message: "Thiếu thông tin công việc (job.title)." });
    }
    if (!candidate || !candidate.email || !candidate.fullname) {
      return res.status(400).json({ message: "Thiếu thông tin ứng viên." });
    }
    if (!result) {
      return res.status(400).json({ message: "Thiếu kết quả phỏng vấn (result)." });
    }

    // --- 2. Cấu hình nội dung dựa trên kết quả ---
    const isPassed = result === 'accepted';
    
    // Cấu hình cho trường hợp ĐẬU
    const passedConfig = {
      subject: `Chúc mừng! Bạn đã trúng tuyển vị trí ${job.title} tại ${hr.companyName}`,
      headerTitle: "Chúc mừng bạn đã trúng tuyển! 🎉",
      headerColor: "#059669", // Màu xanh thành công
      intro: `Chúng tôi rất vui mừng thông báo rằng bạn đã <strong>VƯỢT QUA</strong> vòng phỏng vấn và chính thức trúng tuyển.`,
      detailsTitle: "Chi tiết công việc:",
      messageLabel: "Lời nhắn/Offer từ nhà tuyển dụng:",
      defaultMessage: "Chào mừng bạn gia nhập đội ngũ của chúng tôi. Chúng tôi sẽ sớm gửi Offer chi tiết qua email.",
      ctaText: "Xác nhận ngay",
      ctaLink: `${process.env.CLIENT_URL}/applyted`,
      footerText: "Chúng tôi rất mong chờ được làm việc cùng bạn!"
    };

    // Cấu hình cho trường hợp RỚT
    const rejectedConfig = {
      subject: `Thông báo kết quả phỏng vấn vị trí ${job.title} - ${hr.companyName}`,
      headerTitle: "Thông báo kết quả phỏng vấn",
      headerColor: "#6b7280", // Màu xám trung tính
      intro: `Cảm ơn bạn đã dành thời gian tham gia phỏng vấn. Sau khi cân nhắc kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn <strong>chưa phù hợp</strong> để đi tiếp ở thời điểm hiện tại.`,
      detailsTitle: "Vị trí ứng tuyển:",
      messageLabel: "Góp ý từ nhà tuyển dụng:",
      defaultMessage: "Chúng tôi đánh giá cao năng lực của bạn và sẽ lưu hồ sơ cho các cơ hội trong tương lai.",
      ctaText: "Xem các công việc khác",
      ctaLink: `${process.env.CLIENT_URL}/home`, // Link về trang chủ tìm việc
      footerText: "Chúc bạn sớm tìm được bến đỗ phù hợp!"
    };

    const config = isPassed ? passedConfig : rejectedConfig;
    const hrMessage = feedback || config.defaultMessage;

    // --- 3. HTML Template ---
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 95%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        
        <div style="background-color: ${config.headerColor}; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">${config.headerTitle}</h1>
        </div>

        <div style="padding: 25px;">
          <h2 style="color: #333;">Xin chào ${candidate.fullname},</h2>
          
          <p>${config.intro}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px 20px; border-radius: 5px; border: 1px solid #eee; margin: 20px 0;">
            <h3 style="margin: 0 0 5px; color: ${config.headerColor};">${job.title}</h3>
            <p style="margin: 0;"><strong>Công ty:</strong> ${hr.companyName}</p>
          </div>

          <div style="border-left: 4px solid ${config.headerColor}; padding-left: 15px; margin-bottom: 25px;">
            <p style="margin: 0 0 5px; font-weight: bold; color: #555;">${config.messageLabel}</p>
            <p style="margin: 0; font-style: italic; color: #333;">
              "${hrMessage}"
            </p>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${config.ctaLink}"
              target="_blank"
              style="background-color: ${config.headerColor}; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              ${config.ctaText}
            </a>
          </div>

          <p style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #666;">
            ${config.footerText}
          </p>
          <p style="font-size: 12px; color: #999;">Trân trọng,<br>Đội ngũ SmartHire</p>
        </div>
      </div>
    `;

    const textFallback = `
      Xin chào ${candidate.fullname},
      
      ${isPassed ? "CHÚC MỪNG! Bạn đã trúng tuyển" : "Thông báo kết quả phỏng vấn"} vị trí ${job.title} tại ${hr.companyName}.
      
      Lời nhắn từ HR: "${hrMessage}"
      
      Vui lòng kiểm tra email hoặc đăng nhập SmartHire để xem chi tiết.
    `;

    const mailOptions = {
      from: `SmartHire <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      subject: config.subject,
      text: textFallback,
      html: htmlTemplate,
    };

    // --- 4. Gửi email ---
    console.log(`📧 Gửi email kết quả (${result}) đến: ${candidate.email}`);
    await transporter.sendMail(mailOptions);

    res.json({
      message: `Đã gửi thông báo kết quả (${result}) cho ứng viên ${candidate.fullname}.`,
    });

  } catch (err) {
    console.error("❌ Email error:", err.message);
    res.status(500).json({
      message: "Gửi email kết quả thất bại",
      error: err.message,
    });
  }
};