const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { TaiKhoan } = require("../model/tai_khoan");
const { sequelize } = require("../config/database");
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
    let user = await TaiKhoan.findOne({
      where: {
        username: data.username,
      },
    });
    if (!user) {
      return -1;
    } else {
      console.log(data.password);
      console.log(user.password);
      const check = await bcrypt.compare(data.password, user.password);
      console.log("check", check);
      if (!check) {
        return -2;
      } else {
        return user;
      }
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

    // Kiểm tra quyền sửa tài khoản
    if (user.id !== tai_khoan.id && user.cap === tai_khoan.cap) {
      throw new Error("Bạn không có quyền sửa tài khoản cùng cấp");
    }

    const oldPhongBanId = tai_khoan.PhongBanId;

    // Cập nhật tất cả dữ liệu trong data trực tiếp (bao gồm password nếu có)
    await tai_khoan.update(data);

    // Reload instance để chắc chắn dữ liệu mới nhất
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
    console.log(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyToken,
  updateTaiKhoan,
};
