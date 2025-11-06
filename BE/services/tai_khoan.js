const { sequelize } = require("../config/database");
const { ChiTietHanhDong } = require("../model/chi_tiet_hanh_dong");
const { TaiKhoan } = require("../model/tai_khoan");

const findUsers = async (user) => {
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
};

module.exports = {
  findUsers,
};
