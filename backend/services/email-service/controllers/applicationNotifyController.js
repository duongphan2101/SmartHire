const nodemailer = require("nodemailer");

// Khởi tạo transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Kiểm tra kết nối
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter error:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

exports.notifyApplication = async (req, res) => {
  try {
    const { user, hr, job } = req.body;

    // --- Validation (Giữ nguyên) ---
    if (!user || !job) {
      return res.status(400).json({ message: "Thiếu dữ liệu gửi mail" });
    }
    if (!user.email) {
      return res.status(400).json({
        message: "Thiếu email người dùng",
        data: { user, hr },
      });
    }

    // --- 1. Mail cho User (Template mới) ---
    const userSubject = `Xác nhận: Đã nhận hồ sơ ứng tuyển vị trí ${job.title}`;
    const userHtmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 95%; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Hồ sơ đã được nhận - SmartHire</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333;">Xin chào ${user.fullname},</h2>
          <p>Cảm ơn bạn đã quan tâm và ứng tuyển vào vị trí <strong>${job.title
      }</strong> tại <strong>${job.companyName || "Công ty"
      }</strong> thông qua hệ thống SmartHire.</p>
          <p>Chúng tôi xác nhận đã nhận được hồ sơ của bạn. Nhà tuyển dụng sẽ xem xét hồ sơ và sẽ sớm liên hệ với bạn nếu hồ sơ của bạn phù hợp với các bước tiếp theo.</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <strong style="color: #059669;">Chi tiết công việc đã ứng tuyển:</strong>
            <ul style="list-style-type: none; padding-left: 0; margin-top: 10px;">
              <li style="margin-bottom: 8px;">
                <strong>Vị trí:</strong> ${job.title}
              </li>
              <li>
                <strong>Địa điểm:</strong> ${job.location}
              </li>
            </ul>
          </div>
          
          <p style="margin-top: 25px;">
            Chúc bạn may mắn trong quá trình tuyển dụng!
          </p>
          <p style="margin-top: 30px;">Trân trọng,<br>Đội ngũ SmartHire</p>
        </div>
      </div>
    `;
    const userTextFallback = `
      Xin chào ${user.fullname},
      Cảm ơn bạn đã ứng tuyển vào vị trí ${job.title} tại ${job.companyName || "Công ty"
      }.
      Chúng tôi đã nhận được hồ sơ của bạn và sẽ xem xét trong thời gian sớm nhất. 
      Bạn sẽ nhận được thông báo về các bước tiếp theo qua email.
      Chúc bạn may mắn!
      Trân trọng, Đội ngũ SmartHire.
    `;

    const userMailOptions = {
      from: `SmartHire <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: userSubject,
      text: userTextFallback, // Nội dung dự phòng
      html: userHtmlTemplate, // Template HTML
    };

    console.log("Gửi email xác nhận đến User:", user.email);
    await transporter.sendMail(userMailOptions);
    console.log("Email User gửi thành công");

    // --- 2. Mail cho HR (Template mới & tùy chọn) ---
    let hrEmailSent = false;
    if (hr && hr.email) {
      const hrSubject = `Ứng viên mới: ${user.fullname} đã ứng tuyển vào vị trí ${job.title}`;
      const hrHtmlTemplate = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1E40AF; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Thông báo ứng viên mới</h1>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #333;">Xin chào ${hr.fullname || "Nhà tuyển dụng"},</h2>
            <p>Bạn có một ứng viên mới vừa ứng tuyển vào vị trí <strong>${job.title
        }</strong> trên hệ thống SmartHire.</p>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
              <strong style="color: #1E40AF;">Thông tin ứng viên:</strong>
              <ul style="list-style-type: none; padding-left: 0; margin-top: 10px;">
                <li style="margin-bottom: 8px;">
                  <strong>Họ tên:</strong> ${user.fullname}
                </li>
                <li>
                  <strong>Email:</strong> <a href="mailto:${user.email}">${user.email
        }</a>
                </li>
              </ul>
            </div>
            
            <p style="margin-top: 25px;">
              Vui lòng truy cập hệ thống SmartHire để xem hồ sơ chi tiết và thực hiện các bước tiếp theo.
            </p>
            <p style="margin-top: 30px;">Trân trọng,<br>Đội ngũ SmartHire</p>
          </div>
        </div>
      `;
      const hrTextFallback = `
        Xin chào ${hr.fullname || "HR"},
        Ứng viên ${user.fullname} (${user.email
        }) vừa ứng tuyển vào công việc: ${job.title} tại ${job.location}.
        Trân trọng.
      `;

      const hrMailOptions = {
        from: `SmartHire (No-Reply) <${process.env.EMAIL_USER}>`,
        to: hr.email,
        subject: hrSubject,
        text: hrTextFallback,
        html: hrHtmlTemplate,
      };

      console.log("Gửi email thông báo đến HR:", hr.email);
      await transporter.sendMail(hrMailOptions);
      console.log("Email HR gửi thành công");
      hrEmailSent = true;
    } else {
      console.warn("Không gửi email cho HR do thiếu hr.email");
    }

    res.json({
      message: `Đã gửi mail cho ${hrEmailSent ? "HR và ứng viên" : "ứng viên"
        }`,
    });
  } catch (err) {
    console.error("Email error:", err.message);
    res.status(500).json({ message: "Gửi mail thất bại", error: err.message });
  }
};

exports.notifyInterview = async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ body
    const { candidate, hr, job, interview } = req.body;

    // console.log("Payload nhận được cho email phỏng vấn:", {
    //   candidate,
    //   hr,
    //   job,
    //   interview,
    // });

    // 2. Validation (Kiểm tra dữ liệu)
    if (!candidate || !hr || !job || !interview) {
      return res.status(400).json({
        message:
          "Thiếu dữ liệu. Cần (candidate, hr, job, interview) để gửi mail.",
      });
    }

    if (!candidate.email) {
      return res
        .status(400)
        .json({ message: "Thiếu email của ứng viên (candidate.email)" });
    }
    if (!hr.email) {
      return res
        .status(400)
        .json({ message: "Thiếu email của HR (hr.email) để ứng viên liên hệ" });
    }

    // 3. Format lại dữ liệu cho đẹp
    const formattedTime = new Date(interview.scheduledAt).toLocaleString(
      "vi-VN",
      {
        weekday: "long",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Ho_Chi_Minh",
      }
    );

    const formattedMode =
      interview.mode === "online" ? "Trực tuyến (Online)" : "Trực tiếp (Offline)";

    // 4. Tạo nội dung Email (HTML Template)
    const subject = `Thư mời phỏng vấn cho vị trí: ${job.title}`;

    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 95%; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Thư mời phỏng vấn - SmartHire</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333;">Xin chào ${candidate.fullname || "Ứng viên"},</h2>
          <p>Chúc mừng bạn! Nhà tuyển dụng <strong>${hr.companyName || "Công ty"}</strong> đã xem xét hồ sơ của bạn và muốn mời bạn tham gia một buổi phỏng vấn cho vị trí <strong>${job.title}</strong>.</p>
          <p>Thông tin chi tiết về buổi phỏng vấn như sau:</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
            <ul style="list-style-type: none; padding-left: 0;">
              <li style="margin-bottom: 12px;">
                <strong>🗓️ Thời gian:</strong> ${formattedTime} (Giờ Việt Nam)
              </li>
              <li style="margin-bottom: 12px;">
                <strong>🖥️ Hình thức:</strong> ${formattedMode}
              </li>
              <li style="margin-bottom: 12px;">
                <strong>📍 Địa điểm / Link:</strong> ${interview.location}
              </li>
              ${interview.note
        ? `<li style="margin-bottom: 12px;">
                       <strong>📝 Ghi chú từ HR:</strong> ${interview.note}
                     </li>`
        : ""
      }
            </ul>
          </div>
          
          <p style="margin-top: 25px;">
            Vui lòng <strong>trả lời (reply)</strong> email này để xác nhận sự tham gia của bạn.
          </p>
          <p>
            Nếu có bất kỳ câu hỏi nào, bạn có thể liên hệ trực tiếp với ${hr.fullname} qua email: 
            <a href="mailto:${hr.email}">${hr.email}</a>.
          </p>
          <p>Chúc bạn có một buổi phỏng vấn thành công!</p>
          <p style="margin-top: 30px;">Trân trọng,<br>Đội ngũ SmartHire</p>
        </div>
      </div>
    `;

    // 5. Tạo nội dung Text (dự phòng)
    const textFallback = `
      Xin chào ${candidate.fullname},
      Chúc mừng! Nhà tuyển dụng ${hr.companyName || "Công ty"} muốn mời bạn phỏng vấn vị trí ${job.title}.

      Thông tin phỏng vấn:
      - Thời gian: ${formattedTime} (Giờ Việt Nam)
      - Hình thức: ${formattedMode}
      - Địa điểm / Link: ${interview.location}
      ${interview.note ? `- Ghi chú: ${interview.note}` : ""}

      Vui lòng trả lời (reply) email này để xác nhận tham gia.
      Liên hệ HR: ${hr.fullname} (${hr.email}) nếu có câu hỏi.
      
      Chúc bạn may mắn!
      Đội ngũ SmartHire.
    `;

    // 6. Cấu hình Mail Options
    const mailOptions = {
      from: `SmartHire <${process.env.EMAIL_USER}>`,
      to: candidate.email,
      subject: subject,
      text: textFallback,
      html: htmlTemplate,
      replyTo: hr.email,
    };

    // 7. Gửi email
    //console.log(`Đang chuẩn bị gửi email mời phỏng vấn đến: ${candidate.email}`);
    await transporter.sendMail(mailOptions);
    //console.log("Email mời phỏng vấn đã gửi thành công.");

    res.json({ message: "Gửi email mời phỏng vấn thành công" });
  } catch (err) {
    console.error("Lỗi khi gửi email phỏng vấn:", err.message);
    res
      .status(500)
      .json({ message: "Gửi mail phỏng vấn thất bại", error: err.message });
  }
};