const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

exports.sendVerifyEmail = async (req, res) => {
  try {
    const { email, user_id } = req.body;

    // Tạo token verify
    const token = jwt.sign(
      { email, user_id },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: "1d" }
    );

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // Config mailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"My App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Xác nhận email của bạn",
      html: `
        <h1>Chào mừng!</h1>
        <p>Bấm vào link dưới đây để xác nhận email:</p>
        <a href="${verifyLink}">${verifyLink}</a>
      `,
    });

    res.json({ message: "Đã gửi email xác nhận" });
  } catch (err) {
    console.error("Send email error:", err);
    res.status(500).json({ message: "Lỗi gửi email" });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const payload = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);

    // Gọi sang auth-service để update isVerified
    await axios.post(`${process.env.AUTH_SERVICE_URL}/verify-account`, {
      email: payload.email,
    });

    res.json({ message: "Xác nhận email thành công, bạn có thể đăng nhập" });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};
