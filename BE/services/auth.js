const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan } = require("../model/tai_khoan");
const { PhongBan } = require("../model/phong_ban");
const { ChiTietHanhDong } = require("../model/chi_tiet_hanh_dong");

const registerUser = async (data, user) => {
  try {
    const check = await TaiKhoan.findOne({
      where: {
        username: data.username,
      },
    });
    if (check) {
      return { success: false, error: "Username đã tồn tại" };
    }
    const hashed = await bcrypt.hash(data.password, 10);
    data.password = hashed;
    const user1 = await TaiKhoan.create(data);

    const phongban = await PhongBan.findByPk(data.PhongBanId);
    const soLuong = await TaiKhoan.count({
      where: { PhongBanId: data.PhongBanId },
    });
    await phongban.update({ soluong: soLuong });
    const value = {
      loai_hanh_dong: `Thêm tài khoản nhân viên : ${data.ho_ten} cấp : ${data.cap} thuộc phòng ban : ${phongban.ten}`,
      HanhDongId: user.hanh_dong,
    };
    await ChiTietHanhDong.create(value);

    return { success: true, user: user1 };
  } catch (err) {
    console.error("Lỗi registerUser:", err);
    return { success: false, error: "Username đã tồn tại" };
  }
};

const loginUser = async (data) => {
  try {
    const NOW = Date.now(); // thời điểm hiện tại
    const user = await TaiKhoan.findOne({ where: { username: data.username } });

    if (!user) {
      return { code: -1, message: "Tài khoản không tồn tại" };
    }

    if (user.is_active === false) {
      return {
        code: -3,
        message: "Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên",
      };
    }

    // Reset failed attempts nếu đã quá 1 giờ
    if (
      user.first_failed_at &&
      NOW - user.first_failed_at.getTime() > 60 * 60 * 1000
    ) {
      user.failed_attempts = 0;
      user.first_failed_at = null;
      await user.save();
    }

    const check = await bcrypt.compare(data.password, user.password);

    if (!check) {
      // Sai mật khẩu
      if (!user.first_failed_at) {
        user.first_failed_at = new Date(NOW);
        user.failed_attempts = 1;
      } else {
        user.failed_attempts += 1;
      }

      let remainingAttempts = Math.max(5 - user.failed_attempts, 0);

      if (user.failed_attempts >= 5) {
        user.is_active = false;
        await user.save();
        return {
          code: -3,
          message: "Tài khoản bị khóa tạm thời do nhập sai quá nhiều lần",
        };
      }

      await user.save();
      return { code: -2, remainingAttempts }; // trả thêm số lần còn lại
    } else {
      // Đúng mật khẩu
      // Reset failed attempts
      user.failed_attempts = 0;
      user.first_failed_at = null;
      await user.save();

      return user;
    }
  } catch (error) {
    console.log(error);
    return "error";
  }
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) return reject(new Error("Invalid Token"));
      resolve(decoded);
    });
  });
};

const updateTaiKhoan = async (id, data, user) => {
  try {
    const tai_khoan = await TaiKhoan.findByPk(id);
    if (user.cap != 0) {
      if (user.id !== tai_khoan.id && user.cap === tai_khoan.cap) {
        throw new Error("Bạn không có quyền sửa tài khoản cùng cấp");
      }
    }

    const oldPhongBanId = tai_khoan.PhongBanId;

    await tai_khoan.update(data);

    await tai_khoan.reload();

    // Nếu đổi phòng ban thì cập nhật số lượng nhân viên
    if (data.PhongBanId && data.PhongBanId !== oldPhongBanId) {
      const oldCount = await TaiKhoan.count({
        where: { PhongBanId: oldPhongBanId },
      });
      await PhongBan.update(
        { soluong: oldCount },
        { where: { id: oldPhongBanId } }
      );

      const newCount = await TaiKhoan.count({
        where: { PhongBanId: data.PhongBanId },
      });
      await PhongBan.update(
        { soluong: newCount },
        { where: { id: data.PhongBanId } }
      );
    }

    // Lưu log hành động
    const value = {
      loai_hanh_dong: `Cập nhật tài khoản nhân viên : ${tai_khoan.ho_ten} cấp : ${tai_khoan.cap}`,
      HanhDongId: user.hanh_dong,
    };
    await ChiTietHanhDong.create(value);

    return tai_khoan;
  } catch (error) {
    throw error;
  }
};

const deleteTaiKhoan = async (id, user) => {
  try {
    const tai_khoan = await TaiKhoan.findByPk(id);
    if (user.cap != 0) {
      if (user.id !== tai_khoan.id && user.cap === tai_khoan.cap) {
        throw new Error("Bạn không có quyền xóa tài khoản cùng cấp");
      }
    }
    await tai_khoan.destroy();

    const soLuong = await TaiKhoan.count({
      where: { PhongBanId: tai_khoan.PhongBanId },
    });
    await PhongBan.update(
      { soluong: soLuong },
      { where: { id: tai_khoan.PhongBanId } }
    );
    // Lưu log hành động
    const value = {
      loai_hanh_dong: `Xóa tài khoản nhân viên : ${tai_khoan.ho_ten} cấp : ${tai_khoan.cap}`,
      HanhDongId: user.hanh_dong,
    };
    await ChiTietHanhDong.create(value);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  updateTaiKhoan,
  deleteTaiKhoan,
};
