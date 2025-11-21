const { sequelize } = require("../config/database");
const sendMail = require("../config/sendMail");
const { ChiTietHanhDong } = require("../model/chi_tiet_hanh_dong");
const { TaiKhoan } = require("../model/tai_khoan");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
load_env = require("dotenv").config();
const SECRET_KEY = process.env.JWT;
const findUsers = async (user) => {
  try {
    let condition = "";

    if (user.cap === 0) {
      condition = "1=1";
    } else if (user.cap === 1) {
      condition = "tk.cap >= 1";
    } else if (user.cap === 2) {
      condition = `tk.cap > 2 AND pb.id = ${user.PhongBanId}`;
    } else if (user.cap === 3) {
      condition = `tk.cap = 3 AND tk.id = ${user.id}`;
    }

    const sql = `
      WITH ThongTinDangNhap AS (
        SELECT 
            ttdn.id,
            ttdn.trang_thai,
            ttdn.ngay_thu_hoi,
            ttdn.ngay_cap,
            ts.ten_tai_san,
            ncc.ten AS ten_nha_cung_cap,
            tk.id AS tai_khoan_id
        FROM thong_tin_dang_nhap_tai_san ttdn
        JOIN tai_san ts ON ts.id = ttdn.tai_san_id
        JOIN nha_cung_cap ncc ON ncc.id = ts.nha_cung_cap_id
        JOIN tai_khoan tk ON tk.id = ttdn.nguoi_nhan_id
      )
      SELECT
          tk.*,
          pb.ten,
          JSONB_AGG(
              DISTINCT JSONB_BUILD_OBJECT(
                  'thong_tin_dang_nhap_id', ttdn.id,
                  'trang_thai', ttdn.trang_thai,
                  'ngay_thu_hoi', ttdn.ngay_thu_hoi,
                  'ngay_cap', ttdn.ngay_cap,
                  'ten_tai_san', ttdn.ten_tai_san,
                  'ten_nha_cung_cap', ttdn.ten_nha_cung_cap
              )
          ) AS thong_tin_dang_nhap
      FROM tai_khoan tk
      JOIN phong_ban pb ON tk.phong_ban_id = pb.id
      LEFT JOIN ThongTinDangNhap ttdn ON ttdn.tai_khoan_id = tk.id
      WHERE ${condition}
      GROUP BY tk.id, pb.ten
      ORDER BY tk.ho_ten;
    `;

    const results = await sequelize.query(sql, {
      type: sequelize.QueryTypes.SELECT,
    });

    const value = {
      loai_hanh_dong: `Lấy danh sách nhân viên (theo quyền cap=${user.cap})`,
      HanhDongId: user.hanh_dong,
    };
    await ChiTietHanhDong.create(value);

    return results;
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);
    throw new Error("Lỗi khi tìm kiếm người dùng");
  }
};
function createResetToken(userId, expiresMinutes = 60) {
  const payload = { userId };
  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: `${expiresMinutes}m`,
  });
  return token;
}

function verifyResetToken(token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
}

const forgotPassword = async (email) => {
  try {
    const user = await TaiKhoan.findOne({ where: { email } });
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }
    console.log("Tìm thấy người dùng:", user.email);
    const token = createResetToken(user.id);

    // Sử dụng hàm sendMail có sẵn thay vì tự tạo transporter
    const frontendUrl = process.env.FRONTEND_URL || "https://taisanso.tmedu.vn";
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;
    console.log("Liên kết đặt lại mật khẩu:", resetLink);
    const mailOptions = {
      email: user.email,
      name: user.ho_ten, // Sử dụng ho_ten thay vì name
      resetLink: resetLink,
      email_forgot: true,
    };

    await sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Lỗi khi xử lý quên mật khẩu:", error);
    throw new Error("Lỗi khi xử lý quên mật khẩu");
  }
};

const resetPassword = async (token, newPassword) => {
  try {
    const userId = verifyResetToken(token);

    const user = await TaiKhoan.findByPk(userId);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    await user.update({ password: newPassword });

    return true;
  } catch (error) {
    console.error("Lỗi khi reset mật khẩu:", error);
    throw new Error("Lỗi khi reset mật khẩu: " + error.message);
  }
};

module.exports = {
  findUsers,
  forgotPassword,
  resetPassword,
  verifyResetToken,
};
