const {
  registerUser,
  loginUser,
  updateTaiKhoan,
  deleteTaiKhoan,
} = require("../services/auth");
const {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} = require("../services/tai_khoan");
const tokenCookie = require("../middleware/cookie");
const register = async (req, res) => {
  try {
    const result = await registerUser(req.body, req.user);
    if (result.error) {
      return res.status(400).json({ status: false, error: result.error });
    }
    res.status(201).json({
      status: true,
      message: "Đăng ký thành công.",
      user: result.user,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const login = async (req, res) => {
  try {
    const user = await loginUser(req.body, req.user);
    if (user == -1) {
      // Không tìm thấy user
      return res.status(404).json({
        // 404 Not Found
        success: false,
        message: "Không tìm thấy email",
      });
    }

    if (user.code === -2) {
      return res.status(400).json({
        success: false,
        message: `Sai mật khẩu. Bạn còn ${user.remainingAttempts} lần thử trước khi bị khóa.`,
      });
    }

    if (user.code === -3) {
      return res.status(403).json({
        success: false,
        message:
          user.message ||
          "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
      });
    }

    if (user == "error") {
      // Lỗi chung của server
      return res.status(500).json({
        // 500 Internal Server Error
        success: false,
        message: "Lỗi hệ thống",
      });
    }

    // Thành công
    tokenCookie(user, 200, res);
  } catch (error) {
    console.error("Lỗi trong quá trình đăng nhập:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};
const logout = (req, res) => {
  try {
    res
      .clearCookie("token")
      .status(200)
      .json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi trong quá trình đăng xuất:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const data = await updateTaiKhoan(req.params.id, req.body, req.user);

    res.status(200).json({
      status: true,
      message: "Cập nhật tài khoản thành công",
      data,
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    await deleteTaiKhoan(req.params.id, req.user);
    res.status(200).json({
      status: true,
      message: "Tài khoản đã bị xóa thành công",
    });
  } catch (error) {
    res.status(400).json({ status: false, error: error.message });
  }
};
const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Received forgot password request for email:", email);
    await forgotPassword(email);
    return res.status(200).json({ message: "Đã gửi email đặt lại mật khẩu" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res
      .status(500)
      .json({ message: "Lỗi server", error: error.message });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token và mật khẩu mới là bắt buộc" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự" });
    }

    await resetPassword(token, newPassword);
    return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(400).json({ message: error.message });
  }
};

const verifyTokenController = async (req, res) => {
  try {
    const { token } = req.params;
    const userId = verifyResetToken(token);
    return res.status(200).json({ valid: true, userId });
  } catch (error) {
    return res.status(400).json({ valid: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  update,
  forgotPasswordController,
  resetPasswordController,
  verifyTokenController,
  deleteAccount,
};
