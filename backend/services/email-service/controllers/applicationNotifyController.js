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

    if (!user || !job) {
      return res.status(400).json({ message: "Thiếu dữ liệu gửi mail" });
    }

    if (!user.email) {
      return res.status(400).json({
        message: "Thiếu email người dùng",
        data: { user, hr },
      });
    }

    console.log("Payload nhận được:", { user, hr, job });

    // Mail cho User (bắt buộc)
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Xác nhận ứng tuyển vào ${job.title}`,
      text: `Xin chào ${user.fullname},\n\nCảm ơn bạn đã ứng tuyển vào vị trí ${job.title} tại ${job.location}.\nMức lương: ${job.salary}\n\nChúng tôi đã nhận được hồ sơ của bạn và sẽ xem xét trong thời gian sớm nhất. Bạn sẽ nhận được thông báo về các bước tiếp theo qua email.\n\nChúc bạn may mắn!`,
    };

    console.log("Gửi email đến User:", userMailOptions);
    await transporter.sendMail(userMailOptions);
    console.log("Email User gửi thành công");

    // Mail cho HR (tùy chọn)
    let hrEmailSent = false;
    if (hr && hr.email) {
      const hrMailOptions = {
        from: process.env.EMAIL_USER,
        to: hr.email,
        subject: `Ứng viên mới cho vị trí ${job.title}`,
        text: `Xin chào ${hr.fullname || "HR"},\n\nỨng viên ${user.fullname} (${user.email}) vừa ứng tuyển vào công việc: ${job.title} tại ${job.location}.\nMức lương: ${job.salary}\n\nTrân trọng.`,
      };

      console.log("Gửi email đến HR:", hrMailOptions);
      await transporter.sendMail(hrMailOptions);
      console.log("Email HR gửi thành công");
      hrEmailSent = true;
    } else {
      console.warn("Không gửi email cho HR do thiếu hr.email");
    }

    res.json({
      message: `Đã gửi mail cho ${hrEmailSent ? "HR và ứng viên" : "ứng viên"}`,
    });
  } catch (err) {
    console.error("Email error:", err.response?.data || err.message);
    res.status(500).json({ message: "Gửi mail thất bại", error: err.message });
  }
};