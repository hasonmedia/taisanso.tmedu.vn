const { TaiSan } = require("../model/tai_san");
const { HanhDong } = require("../model/hanh_dong");
const { sequelize } = require("../config/database");
const { ChiTietHanhDong } = require('../model/chi_tiet_hanh_dong');
const { DanhMucTaiSan } = require('../model/danh_muc_tai_san');

const getTaiSan = async (data, user) => {
    let filter = ``;
    let DanhMucTaiSan1 = null;
    if (data) {
        DanhMucTaiSan1 =await DanhMucTaiSan.findByPk(data);
        filter = filter + `WHERE ts.danh_muc_tai_san_id = ${data}`;
    }
  const sql = `SELECT 
                    ts.*,
                    danhMucTaiSan.id AS danh_muc_tai_san_id,
                    danhMucTaiSan.ten AS danh_muc_tai_san_ten,
                    danhMucTaiSan.lien_he AS danh_muc_tai_san_lien_he,
                    danhMucTaiSan.link AS danh_muc_tai_san_link
                FROM 
                    tai_san AS ts
                JOIN 
                    danh_muc_tai_san AS danhMucTaiSan ON danhMucTaiSan.id = ts.danh_muc_tai_san_id
                ${filter};`;
  const results = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });
  let moTaHanhDong = "Lấy danh sách tài sản";
  if (data) {
    moTaHanhDong += ` theo danh mục: ${DanhMucTaiSan1.ten}`;
  }

  const value = {
    loai_hanh_dong: moTaHanhDong,
    HanhDongId: user.hanh_dong
  };

  await ChiTietHanhDong.create(value);
  return results;
};

const addTaiSan = async (data, user) => {
    const newTaiSan = await TaiSan.create(data);
    const value = {
        loai_hanh_dong: `Thêm tài sản mới có tên là ${data.ten_tai_san} và nhà cung cấp là ${data.ten_nha_cung_cap}`,
        HanhDongId: user.hanh_dong
    }
    await ChiTietHanhDong.create(value);
    return newTaiSan;
}
const updateTaiSan = async (id, data, user) => {
    const taiSan = await TaiSan.findByPk(id);
    if (!taiSan) {
        return new Error("Tài sản không tồn tại");
    }
    await taiSan.update(data);
    const value = {
            loai_hanh_dong: `Cập nhật tài sản có tên là ${data.ten_tai_san} và nhà cung cấp là ${data.ten_nha_cung_cap}`,
           HanhDongId: user.hanh_dong
    }
    await ChiTietHanhDong.create(value);
    return taiSan;
}
const deleteTaiSan = async (id, user) => {
    const taiSan = await TaiSan.findByPk(id);
    const ten_tai_san = taiSan.ten_tai_san;
    if (!taiSan) {
        return new Error("Tài sản không tồn tại");
    }
    await taiSan.destroy();
    const value = {
            loai_hanh_dong: `Xóa tài sản ${ten_tai_san}`,
            HanhDongId: user.hanh_dong
    }
    await ChiTietHanhDong.create(value);
    return { message: "Tài sản đã được xóa thành công" };
}

const getTaiSanSapHetHan = async (user) => {
    const today = new Date();
    const tenDaysFromNow = new Date(today);
    tenDaysFromNow.setDate(today.getDate() + 10);

    const sql = `SELECT 
                    ts.*,
                    danhMucTaiSan.id AS danh_muc_tai_san_id,
                    danhMucTaiSan.ten AS danh_muc_tai_san_ten,
                    danhMucTaiSan.lien_he AS danh_muc_tai_san_lien_he,
                    danhMucTaiSan.link AS danh_muc_tai_san_link,
                    CASE 
                        WHEN (ts.ngay_het_han - CURRENT_DATE) <= 3 THEN 'critical'
                        WHEN (ts.ngay_het_han - CURRENT_DATE) <= 7 THEN 'warning'
                        WHEN (ts.ngay_het_han - CURRENT_DATE) <= 10 THEN 'notice'
                        ELSE 'normal'
                    END AS muc_do_canh_bao,
                    (ts.ngay_het_han - CURRENT_DATE) AS so_ngay_con_lai
                FROM 
                    tai_san AS ts
                JOIN 
                    danh_muc_tai_san AS danhMucTaiSan 
                    ON danhMucTaiSan.id = ts.danh_muc_tai_san_id
                WHERE 
                    ts.ngay_het_han IS NOT NULL 
                    AND ts.ngay_het_han BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '10 days')
                ORDER BY 
                    ts.ngay_het_han ASC;
`;

    const results = await sequelize.query(sql, { type: sequelize.QueryTypes.SELECT });

    // Phân loại theo mức độ cảnh báo
    const criticalAssets = results.filter(asset => asset.so_ngay_con_lai <= 3);
    const warningAssets = results.filter(asset => asset.so_ngay_con_lai > 3 && asset.so_ngay_con_lai <= 7);
    const noticeAssets = results.filter(asset => asset.so_ngay_con_lai > 7 && asset.so_ngay_con_lai <= 10);

    // Ghi log hành động
    const value = {
        loai_hanh_dong: `Kiểm tra tài sản sắp hết hạn - Tìm thấy ${results.length} tài sản cần chú ý`,
        HanhDongId: user.hanh_dong
    };
    await ChiTietHanhDong.create(value);

    return {
        total: results.length,
        critical: {
            count: criticalAssets.length,
            message: "Tài sản hết hạn trong 3 ngày hoặc ít hơn",
            assets: criticalAssets
        },
        warning: {
            count: warningAssets.length,
            message: "Tài sản hết hạn trong 4-7 ngày",
            assets: warningAssets
        },
        notice: {
            count: noticeAssets.length,
            message: "Tài sản hết hạn trong 8-10 ngày",
            assets: noticeAssets
        },
        all_assets: results
    };
}

module.exports = { getTaiSan, addTaiSan, updateTaiSan, deleteTaiSan, getTaiSanSapHetHan };
