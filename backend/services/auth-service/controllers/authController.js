const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { HOSTS } = require("../../host");
const { OAuth2Client } = require("google-auth-library");

// Tạo token
const generateTokens = (account) => {
  const payload = { email: account.email, user_id: account.user_id };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

// Đăng ký
exports.register = async (req, res) => {
  try {
    const host = HOSTS.userService;
    const { email, password, fullname } = req.body;

    // 1. Check email tồn tại chưa
    const exist = await Account.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // 2. Gọi user-service tạo user
    const userResp = await axios.post(`${host}`, {
      fullname,
      email,
      avatar:
        "https://i.pinimg.com/736x/f5/52/a1/f552a14040107decc9a74a50e5a72423.jpg",
      dob: null,
      phone: null,
    });

    const user_id = userResp.data._id;

    // 3. Hash password + lưu vào Account
    const hashedPwd = await bcrypt.hash(password, 10);
    const newAcc = await Account.create({
      email,
      user_id,
      password: hashedPwd,
      isVerified: false, // mặc định chưa verify
    });

    // 4. Gửi email xác nhận
    const emailUrl = `${HOSTS.emailService}/api/email/send-verify`; // Cập nhật endpoint
    console.log("Gửi yêu cầu đến email service:", { url: emailUrl, data: { email, user_id } });
    await axios.post(emailUrl, {
      email,
      user_id,
    });

    return res.status(201).json({
      message:
        "Đăng ký thành công, vui lòng kiểm tra email để xác nhận tài khoản",
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const host = HOSTS.userService;
    const { email, password } = req.body;

    // 1. Tìm account theo email
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(400).json({ message: "Sai email hoặc password" });
    }

    // 2. Check đã verify chưa
    if (!account.isVerified) {
      return res.status(403).json({ message: "Email chưa được xác nhận" });
    }

    // 3. So sánh password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai email hoặc password" });
    }

    // 4. Gọi sang User Service để lấy role
    const userRes = await axios.get(`${host}/emailfind/${email}`);
    const user = userRes.data;

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }

    // 5. Generate token
    const tokens = generateTokens({
      accountId: account._id,
      email: account.email,
      role: user.role,
    });

    // 6. Trả response
    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: {
        email: account.email,
        user_id: user._id,
        role: user.role,
      },
      ...tokens,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Refresh token
exports.refresh = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Refresh token không hợp lệ" });
  }
};

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

exports.loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const userServiceUrl = HOSTS.userService;
    let user;

    try {
      const response = await axios.get(`${userServiceUrl}/emailfind/${encodeURIComponent(email)}`);
      user = response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const createResponse = await axios.post(`${userServiceUrl}`, {
          email,
          fullname: name,
          avatar: picture,
          role: "user",
          dob: null,
          phone: null,
        });
        user = createResponse.data;
      } else {
        throw error;
      }
    }

    const tokens = generateTokens({
      email: user.email,
      user_id: user._id,
    });

    res.json({
      ...tokens,
      user,
    });

  } catch (err) {
    console.error("Google login error:", err.message);
    res.status(401).json({ message: "Google login failed" });
  }
};

// Đăng nhập bằng Facebook
exports.loginWithFacebook = async (req, res) => {
  try {
    const { accessToken, userID } = req.body;
    if (!accessToken || !userID) {
      return res.status(400).json({ message: "Thiếu Facebook token" });
    }

    const fbResp = await axios.get(
      `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { email, name, picture } = fbResp.data;

    if (!email) {
      return res.status(400).json({ message: "Token Facebook không hợp lệ" });
    }

    let account = await Account.findOne({ email });

    if (!account) {

      const host = HOSTS.userService;
      const userResp = await axios.post(`${host}`, {
        fullname: name,
        email,
        avatar: picture.data.url,
      });

      const user_id = userResp.data._id;

      account = await Account.create({ email, user_id, password: null });
    }

    const tokens = generateTokens(account);

    return res.json({
      message: "Đăng nhập Facebook thành công",
      user: {
        email,
        user_id: account.user_id,
        fullname: name,
        avatar: picture.data.url,
      },
      ...tokens,
    });
  } catch (err) {
    console.error("Login Facebook error:", err.response?.data || err.message);
    return res.status(500).json({ message: "Đăng nhập Facebook thất bại" });
  }
  
};

exports.updatePassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Nhận yêu cầu cập nhật mật khẩu cho email: ${email}`);
        const account = await Account.findOne({ email });
        if (!account) {
            console.error(`Không tìm thấy tài khoản với email: ${email}`);
            return res.status(404).json({ message: "Account không tồn tại" });
        }
        console.log("Đã tìm thấy tài khoản. Bắt đầu hash mật khẩu.");
        const hashedPwd = await bcrypt.hash(password, 10);
        account.password = hashedPwd;
        await account.save();
        console.log("Cập nhật mật khẩu thành công.");
        return res.status(200).json({ message: "Cập nhật password thành công" });
    } catch (err) {
        console.error("Update password error:", err);
        return res.status(500).json({ message: "Có lỗi xảy ra: " + err.message });
    }
};
// Xác thực tài khoản
exports.verifyAccount = async (req, res) => {
  try {
    const { email } = req.body;

    const account = await Account.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    }

    return res.json({ message: "Tài khoản đã được xác thực", account });
  } catch (err) {
    console.error("Verify account error:", err.message);
    return res.status(500).json({ message: "Lỗi xác thực tài khoản" });
  }
};
