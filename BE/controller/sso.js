const ssoService = require("../services/sso");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createJwtToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      ho_ten: user.ho_ten,
      cap: user.cap,
    },
    process.env.JWT,
    { expiresIn: "7d" }
  );
};

const getRedirectUrlByRole = (role) => {
  switch (role) {
    case 0:
      return "/root/dashboard";
    case 1:
      return "/dashboard";
    case 2:
      return "/dashboard_manager";
    case 3:
      return "/user";
    default:
      return "/login";
  }
};

/**
 * Xử lý POST /api/sso/initiate
 * Nhận email và chuyển hướng người dùng đi.
 */
const initiateLogin = async (req, res) => {
  try {
    const { email } = req.body;

    // Logic nghiệp vụ và validation cơ bản
    if (!email) {
      return res.status(400).send("Email là bắt buộc.");
    }

    const authorizationUrl = await ssoService.initiateSsoLogin(email);

    console.log(`Đang chuyển hướng đến: ${authorizationUrl}`);
    return res.json({
      success: true,
      url: authorizationUrl,
    });
  } catch (err) {
    console.error("Lỗi khi khởi tạo SSO:", err.message);
    // Trả lỗi cho Client
    res.status(500).send(err.message);
  }
};

/**
 * Xử lý GET /api/sso/callback
 * Nhận code từ WorkOS, đổi code lấy profile và chuyển hướng nội bộ.
 */
const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const user = await ssoService.handleSsoCallback(code);

    // Tạo JWT token
    const token = createJwtToken(user);

    // Set cookie với token
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
    });

    console.log("Đăng nhập SSO thành công. Email:", user.email);
    console.log("User info:", {
      id: user.id,
      email: user.email,
      ho_ten: user.ho_ten,
      cap: user.cap,
    });
    console.log("Token đã tạo:", token.substring(0, 50) + "...");

    // Chuyển hướng về frontend dựa trên role
    const redirectUrl = getRedirectUrlByRole(user.cap);
    console.log("Redirect URL:", redirectUrl);

    // Redirect về frontend với thông tin user
    const finalRedirectUrl = `http://localhost:5173${redirectUrl}?sso=success`;
    console.log("Final redirect URL:", finalRedirectUrl);
    res.redirect(finalRedirectUrl);
  } catch (err) {
    console.error("Lỗi khi xử lý callback:", err.message);
    res.status(500).send(err.message);
  }
};

module.exports = {
  initiateLogin,
  handleCallback,
};
