const {
  registerUser,
  loginUser,
  updateTaiKhoan,
  deleteTaiKhoan,
} = require("../services/auth");
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

// const login = async (req, res) => {
//   const user = await loginUser(req.body, req.user);
//   if (user == -1) {
//     res.status(404).json({
//       success: false,
//       message: "Không tìm thấy email",
//     });
//   } else if (user == "error") {
//     res.status(505).json("Lỗi hệ thống");
//   } else if (user == -2) {
//     res.status(404).json({
//       success: false,
//       message: "Sai mật khẩu",
//     });
//   } else if (user == -3) {
//     res.status(403).json({
//       success: false,
//       message: "Tài khoản đã bị vô hiệu hóa",
//     });
//   } else {
//     tokenCookie(user, 200, res);
//   }
// };
const login = async (req, res) => {
  const user = await loginUser(req.body, req.user);

  if (user == -1) {
    // Không tìm thấy user
    return res.status(404).json({
      // 404 Not Found
      success: false,
      message: "Không tìm thấy email",
    });
  }

  if (user == -2) {
    // Sai thông tin (mật khẩu)
    return res.status(400).json({
      // 400 Bad Request (hoặc 401)
      success: false,
      message: "Sai mật khẩu",
    });
  }

  if (user == -3) {
    // Bị cấm/vô hiệu hóa
    return res.status(403).json({
      // 403 Forbidden
      success: false,
      message: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.",
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
};
const logout = (req, res) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ message: "Đăng xuất thành công" });
};

const update = async (req, res) => {
  const data = await updateTaiKhoan(req.params.id, req.body, req.user);

  res.status(200).json({
    status: true,
    message: "Cập nhật tài khoản thành công",
    data,
  });
};

const deleteAccount = async (req, res) => {
  await deleteTaiKhoan(req.params.id, req.user);
  res.status(200).json({ message: "Tài khoản đã bị xóa thành công" });
};
module.exports = {
  register,
  login,
  logout,
  update,
  deleteAccount,
};
