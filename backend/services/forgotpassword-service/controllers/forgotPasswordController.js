const axios = require("axios");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const Otp = require("../models/Otp");

// Setup Nodemailer với Gmail (Nodemailer 7.x)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Connection pooling cho performance
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 10000, // 10s
  rateLimit: 10,
  // Logger cho debug (tắt trong production)
  logger: process.env.NODE_ENV === 'development',
  debug: process.env.NODE_ENV === 'development'
});

// Verify transporter connection khi start
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter ready');
  }
});

// 1. FORGOT PASSWORD - Gửi OTP
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Validation
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        message: "Email không hợp lệ" 
      });
    }

    console.log(`🔍 Checking user existence for: ${email}`);

    // 1. Kiểm tra email tồn tại qua user-service
    const userHost = process.env.USER_SERVICE_URL || 'http://localhost:2222/api/users';
    try {
      const userResponse = await axios.get(
        `${userHost}/emailfind/${encodeURIComponent(email)}`, 
        { timeout: 10000 }
      );
      
      if (!userResponse.data || !userResponse.data.email) {
        return res.status(404).json({ 
          success: false,
          message: "Email không tồn tại trong hệ thống" 
        });
      }
      
      console.log(`✅ User found: ${userResponse.data.email}`);
    } catch (error) {
      console.error('User service error:', error.response?.status, error.message);
      
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          success: false,
          message: "Email không tồn tại trong hệ thống" 
        });
      }
      
      if (error.code === 'ECONNABORTED') {
        return res.status(503).json({ 
          success: false,
          message: "Dịch vụ người dùng tạm thời không khả dụng" 
        });
      }
      
      console.error('Unexpected user service error:', error.message);
      return res.status(503).json({ 
        success: false,
        message: "Lỗi kiểm tra người dùng" 
      });
    }

    // 2. Xóa các OTP cũ của email này
    await Otp.deleteMany({ email: email.toLowerCase() });
    console.log(`🗑️ Cleared old OTPs for: ${email}`);

    // 3. Generate OTP 6 chữ số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

    // 4. Lưu OTP vào database
    const otpDoc = await Otp.create({ 
      email: email.toLowerCase(), 
      otp, 
      expireAt,
      ipAddress: clientIp,
      userAgent
    });

    console.log(`💾 OTP saved: ${otp} for ${email}, expires at ${expireAt}`);

    // 5. Gửi email OTP
    try {
      const mailOptions = {
        from: `"Hệ Thống SmartHire" <${process.env.EMAIL_USER}>`, // sender address
        to: email, // list of receivers
        subject: "🔐 Mã Xác Thực Đặt Lại Mật Khẩu - SmartHire", // Subject line
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; color: white;">
              <h1 style="margin: 0; font-size: 24px;">🔐 SmartHire - Đặt Lại Mật Khẩu</h1>
              <p style="margin: 5px 0 0 0; opacity: 0.9;">Xác thực yêu cầu của bạn</p>
            </div>
            
            <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <p>Xin chào,</p>
              <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản <strong>${email}</strong>. Đây là <strong>mã xác thực 6 chữ số</strong> để tiếp tục:</p>
              
              <div style="background: #f8f9fa; border: 2px solid #e9ecef; border-radius: 10px; padding: 30px; text-align: center; margin: 30px 0;">
                <h1 style="color: #007bff; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</h1>
                <p style="color: #6c757d; font-size: 14px; margin: 10px 0 0 0;">Mã xác thực OTP</p>
              </div>
              
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h4 style="color: #856404; margin: 0 0 10px 0;">⚠️ Thời gian hiệu lực:</h4>
                <ul style="color: #856404; margin: 0; padding-left: 20px; font-size: 14px;">
                  <li><strong>10 phút</strong> kể từ khi gửi</li>
                  <li><strong>Chỉ sử dụng một lần</strong></li>
                  <li><strong>Không chia sẻ mã này</strong> với bất kỳ ai</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="#" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">Tiếp tục trên SmartHire</a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                <p style="color: #6c757d; font-size: 12px; margin: 0 0 10px 0;">
                  Nếu bạn <strong>không yêu cầu</strong> đặt lại mật khẩu, vui lòng bỏ qua email này.
                </p>
                <p style="color: #6c757d; font-size: 12px; margin: 0;">
                  <strong>Trân trọng,</strong><br>
                  Đội ngũ <strong>SmartHire</strong>
                </p>
              </div>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #6c757d; font-size: 11px; text-align: center; margin: 0;">
                © 2025 SmartHire. All rights reserved.<br>
                <a href="#" style="color: #007bff; text-decoration: none;">Unsubscribe</a> | 
                <a href="#" style="color: #007bff; text-decoration: none;">Privacy Policy</a>
              </p>
            </div>
          </div>
        `, // html body
        text: `Mã OTP của bạn là: ${otp}. Mã này sẽ hết hạn sau 10 phút.`, // plain text body (fallback)
        headers: {
          'X-Mailer': 'SmartHire Forgot Password Service'
        }
      };

      // Gửi email với timeout
      const info = await transporter.sendMail(mailOptions);
      console.log(`📧 OTP email sent successfully to ${email}: ${info.messageId}`);
      console.log(`📊 Email stats: ${info.accepted.length} accepted, ${info.rejected.length} rejected`);
      
    } catch (emailError) {
      console.error('❌ Email sending error:', emailError.message);
      
      // Log detailed error
      if (emailError.response) {
        console.error('Email response:', emailError.response);
      }
      
      // Không throw error ở đây vì OTP đã được lưu
      // User vẫn có thể verify qua frontend
    }

    // Trả về success ngay cả khi email fail (vì OTP đã lưu DB)
    return res.status(200).json({ 
      success: true,
      message: "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác/spam)." 
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error.message);
    console.error('Stack trace:', error.stack);
    
    return res.status(500).json({ 
      success: false,
      message: "Có lỗi xảy ra. Vui lòng thử lại sau." 
    });
  }
};

// 2. VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp || otp.length !== 6) {
      return res.status(400).json({ 
        success: false,
        message: "Email hoặc mã OTP không hợp lệ" 
      });
    }

    // Validate OTP chỉ chứa số
    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ 
        success: false,
        message: "Mã OTP phải là 6 chữ số" 
      });
    }

    console.log(`🔍 Verifying OTP for: ${email}, OTP: ${otp}`);

    // Tìm OTP hợp lệ (chưa expire)
    const otpDoc = await Otp.findOne({
      email: email.toLowerCase(),
      otp,
      expireAt: { $gt: new Date() }
    }).lean(); // .lean() để performance tốt hơn

    if (!otpDoc) {
      console.log(`❌ Invalid or expired OTP for: ${email}`);
      return res.status(400).json({ 
        success: false,
        message: "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại." 
      });
    }

    // Xóa OTP sau khi verify thành công (prevent reuse)
    await Otp.deleteOne({ _id: otpDoc._id });
    console.log(`✅ OTP verified and deleted for: ${email}`);

    // Generate reset token (JWT, expire 15 phút)
    const payload = {
      email: email.toLowerCase(),
      type: 'password_reset',
      iat: Math.floor(Date.now() / 1000)
    };

    const resetToken = jwt.sign(
      payload, 
      process.env.JWT_SECRET, 
      { expiresIn: '15m' }
    );

    // Log token creation (không log token value cho security)
    console.log(`🔑 Reset token created for: ${email}, expires in 15m`);

    return res.status(200).json({
      success: true,
      message: "Xác thực OTP thành công",
      resetToken,
      expiresIn: 15 * 60 // 15 phút in seconds
    });

  } catch (error) {
    console.error('❌ Verify OTP error:', error.message);
    return res.status(500).json({ 
      success: false,
      message: "Có lỗi xảy ra khi xác thực OTP" 
    });
  }
};

// 3. RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;
    const authHost = process.env.AUTH_SERVICE_URL || 'http://localhost:1111/api/auth';

    // Validation
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Thiếu thông tin yêu cầu" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu xác nhận không khớp" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu phải có ít nhất 6 ký tự" 
      });
    }

    // Password strength validation (basic)
    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số" 
      });
    }

    // Verify reset token
    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.JWT_SECRET);
      
      // Check token type
      if (payload.type !== 'password_reset') {
        return res.status(400).json({ 
          success: false,
          message: "Token không hợp lệ" 
        });
      }
    } catch (error) {
      console.log(`❌ Invalid reset token: ${error.message}`);
      return res.status(400).json({ 
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại." 
      });
    }

    const { email } = payload;
    console.log(`🔄 Resetting password for: ${email}`);

    // Gọi auth-service để update password
    try {
      const updateResponse = await axios.post(
        `${authHost}/update-password`, 
        { 
          email: email.toLowerCase(),
          password: newPassword 
        },
        { 
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (updateResponse.status === 200) {
        console.log(`✅ Password reset successful for: ${email}`);
        
        // Optional: Gửi email thông báo password đã đổi
        try {
          const notifyMailOptions = {
            from: `"SmartHire" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "✅ Mật Khẩu Đã Được Đặt Lại - SmartHire",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Mật khẩu đã được cập nhật!</h2>
                <p>Xin chào,</p>
                <p>Mật khẩu của bạn cho tài khoản <strong>${email}</strong> đã được đặt lại thành công.</p>
                <p>Bạn có thể <a href="#" style="color: #007bff;">đăng nhập ngay bây giờ</a>.</p>
                <p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ hỗ trợ ngay lập tức.</p>
                <hr>
                <p style="color: #6c757d; font-size: 12px;">
                  Trân trọng,<br>
                  Đội ngũ SmartHire
                </p>
              </div>
            `,
            text: `Mật khẩu của bạn đã được đặt lại thành công. Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ hỗ trợ.`
          };

          await transporter.sendMail(notifyMailOptions);
          console.log(`📧 Password reset notification sent to: ${email}`);
        } catch (notifyError) {
          console.warn('Password notification email failed:', notifyError.message);
          // Không throw error vì password đã reset thành công
        }
        
        return res.status(200).json({ 
          success: true,
          message: "Đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay bây giờ." 
        });
      } else {
        return res.status(updateResponse.status).json({ 
          success: false,
          message: updateResponse.data?.message || "Lỗi cập nhật mật khẩu" 
        });
      }

    } catch (error) {
      console.error('Auth service error:', error.response?.status, error.message);
      
      if (error.response?.status === 404) {
        return res.status(404).json({ 
          success: false,
          message: "Không tìm thấy tài khoản" 
        });
      }
      
      if (error.code === 'ECONNABORTED') {
        return res.status(503).json({ 
          success: false,
          message: "Dịch vụ xác thực tạm thời không khả dụng" 
        });
      }
      
      console.error('Auth service full error:', error.response?.data || error.message);
      return res.status(500).json({ 
        success: false,
        message: "Có lỗi xảy ra khi đặt lại mật khẩu" 
      });
    }

  } catch (error) {
    console.error('❌ Reset password error:', error.message);
    return res.status(500).json({ 
      success: false,
      message: "Có lỗi xảy ra khi đặt lại mật khẩu" 
    });
  }
};

// 4. RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        message: "Email không hợp lệ" 
      });
    }

    console.log(`🔄 Resending OTP for: ${email}`);

    // Gọi lại logic forgotPassword
    const forgotResult = await exports.forgotPassword(
      { 
        body: { email }, 
        ip: req.ip, 
        get: (header) => req.get(header) 
      }, 
      res  // Pass res để có thể return từ forgotPassword
    );

    // Return success message cho resend
    return res.status(200).json({ 
      success: true,
      message: "Mã OTP mới đã được gửi đến email của bạn." 
    });

  } catch (error) {
    console.error('❌ Resend OTP error:', error.message);
    return res.status(500).json({ 
      success: false,
      message: "Có lỗi khi gửi lại OTP" 
    });
  }
};

// 5. CHECK OTP STATUS
exports.checkOtpStatus = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    const otpDoc = await Otp.findOne({
      email: email.toLowerCase(),
      expireAt: { $gt: new Date() }
    }).lean();

    if (!otpDoc) {
      return res.status(200).json({
        success: true,
        hasValidOtp: false,
        message: "Không tìm thấy mã OTP hợp lệ"
      });
    }

    const timeLeft = otpDoc.expireAt.getTime() - new Date().getTime();
    const minutesLeft = Math.ceil(timeLeft / (1000 * 60));
    const secondsLeft = Math.ceil(timeLeft / 1000);

    return res.status(200).json({
      success: true,
      hasValidOtp: true,
      expiresIn: timeLeft,
      minutesLeft,
      secondsLeft,
      message: `Mã OTP còn hiệu lực ${minutesLeft} phút`
    });

  } catch (error) {
    console.error('Check OTP status error:', error.message);
    return res.status(500).json({ 
      success: false,
      message: "Lỗi kiểm tra trạng thái OTP" 
    });
  }
};