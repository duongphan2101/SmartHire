const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const axios = require("axios");

exports.sendVerifyEmail = async (req, res) => {
  try {
    // Thêm fullname để email trông thân thiện hơn
    const { email, user_id, fullname } = req.body;

    console.log("Request Body:", req.body);

    // --- Validation ---
    if (!email || !user_id) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin email hoặc user_id" });
    }

    // --- Tạo Token và Link (Giữ nguyên) ---
    const token = jwt.sign(
      { email, user_id },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: "1d" }
    );
    const verifyLink = `${process.env.CLIENT_URL}/verify?token=${token}`;
    //console.log("Verify Link:", verifyLink);

    // --- 1. Template HTML mới (Theo phong cách notifyApplication) ---
    const subject = `SmartHire - Vui lòng xác nhận email của bạn`;
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; width: 95%; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Xác nhận Email - SmartHire</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333;">Xin chào ${fullname || "bạn"},</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>SmartHire</strong>.</p>
          <p>Để hoàn tất quá trình đăng ký và bảo mật tài khoản, vui lòng nhấp vào nút bên dưới để xác nhận địa chỉ email của bạn:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}"
               style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Xác nhận Email
            </a>
          </div>
          
          <p>Nếu bạn không thể nhấp vào nút trên, vui lòng sao chép và dán liên kết sau vào trình duyệt của bạn:</p>
          <p style="word-break: break-all; font-size: 14px;">
            <a href="${verifyLink}" style="color: #2563eb;">${verifyLink}</a>
          </p>

          <p style="margin-top: 25px;">
            Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
          </p>
          <p style="margin-top: 30px;">Trân trọng,<br>Đội ngũ SmartHire</p>
        </div>
      </div>
    `;

    // --- 2. Nội dung Text Fallback ---
    const textFallback = `
      Xin chào ${fullname || "bạn"},
      Cảm ơn bạn đã đăng ký tài khoản tại SmartHire.
      Vui lòng truy cập liên kết sau để xác nhận địa chỉ email của bạn:
      ${verifyLink}

      Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
      Trân trọng,
      Đội ngũ SmartHire
    `;

    // --- 3. Cấu hình Transporter (Giữ nguyên) ---
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // --- 4. Cấu hình Mail Options (Phiên bản đầy đủ) ---
    const mailOptions = {
      from: `"SmartHire" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: textFallback, // Thêm nội dung text
      html: htmlTemplate, // Sử dụng template HTML mới
    };

    // --- 5. Gửi mail ---
    await transporter.sendMail(mailOptions);

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
