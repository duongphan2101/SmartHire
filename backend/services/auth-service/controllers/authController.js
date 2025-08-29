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
      avatar: "https://i.pinimg.com/736x/f5/52/a1/f552a14040107decc9a74a50e5a72423.jpg",
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
    });

    // 4. Generate token
    const tokens = generateTokens(newAcc);

    return res.status(201).json({
      message: "Đăng ký thành công",
      user: { email, user_id, fullname },
      ...tokens,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm account theo email
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(400).json({ message: "Sai email hoặc password" });
    }

    // 2. So sánh password
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai email hoặc password" });
    }

    // 3. Generate token
    const tokens = generateTokens(account);

    return res.status(200).json({
      message: "Đăng nhập thành công",
      user: { email: account.email, user_id: account.user_id },
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
