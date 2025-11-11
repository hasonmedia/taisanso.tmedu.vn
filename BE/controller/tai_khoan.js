const { findUsers } = require("../services/tai_khoan");

const getUsers = async (req, res) => {
  try {
    const user = req.user;
    const results = await findUsers(user);

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên nào" });
    }

    return res.status(200).json({
      data: results
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
const getMe = (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });
    return res.status(200).json({ user: req.user });
  } catch (err) {
    console.error("Lỗi khi lấy thông tin user:", err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
    getUsers,
    getMe
};
