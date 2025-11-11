const { DanhMucTaiSan } = require("../model/danh_muc_tai_san");
const { ChiTietHanhDong } = require("../model/chi_tiet_hanh_dong");
const { NhaCungCap } = require("../model/nha_cung_cap");
const { LoaiTaiSan } = require("../model/loai_tai_san");
const { sequelize } = require("../config/database");
const { TaiSan } = require("../model/tai_san");
//chưa sửa
const getDanhMucTaiSan = async (data, user) => {
  let filter = ``;

  if (data) {
    if (data.danhmuc) {
      filter = filter + `WHERE ncc.ten = '${data.danhmuc}'`;
    }
    if (data.TaiSan) {
      filter = filter + `AND sp.ten_tai_san = '${data.TaiSan}'`;
    }
  }
  const sql = `SELECT 
                    ncc.id AS nha_cung_cap_id,
                    ncc.ten AS ten_nha_cung_cap,
                    ncc.lienhe AS lien_he,
                    ncc.website AS website,
                    ncc.sodienthoai AS so_dien_thoai,
                    sp.id AS tai_san_id,
                    sp.ten_tai_san,
                    sp.tong_so_luong,
                    sp.so_luong_con,
                    dmt.ten AS danh_muc_tai_san,
                    lts.id AS loai_tai_san_id,
                    lts.ten AS loai_tai_san_ten
                FROM
                    danh_muc_tai_san AS dmt
                JOIN 
                    tai_san AS sp ON sp.danh_muc_tai_san_id = dmt.id
                JOIN
                    nha_cung_cap AS ncc ON sp.nha_cung_cap_id = ncc.id
                LEFT JOIN
                    loai_tai_san AS lts ON lts.id = sp.loai_tai_san_id
                ${filter};`;

  const results = await sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });
  const value = {
    loai_hanh_dong: "Lấy danh mục tài sản",
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);
  return results;
};

const getAllDanhMucTaiSan = async (user, filter = {}) => {
  const { NhaCungCapId } = filter;
  const nhaCungCapInclude = {
    model: NhaCungCap,
    required: false,
  };
  const taiSanInclude = {
    model: TaiSan,
    required: false,
    include: [
      nhaCungCapInclude,
      {
        model: LoaiTaiSan,
        required: false,
      },
    ],
  };
  if (NhaCungCapId && NhaCungCapId > 0) {
    nhaCungCapInclude.where = { id: NhaCungCapId };
    nhaCungCapInclude.required = true;
    taiSanInclude.required = true;
  }
  const results = await DanhMucTaiSan.findAll({
    include: [taiSanInclude],
    distinct: true,
  });

  const value = {
    loai_hanh_dong: "Xem tất cả danh mục tài sản",
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);
  return results;
};
const addDanhMucTaiSan = async (data, user) => {
  const newDanhMucTaiSan = await DanhMucTaiSan.create(data);

  const value = {
    loai_hanh_dong: `Thêm danh mục tài sản : ${data.ten}`,
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);
  return newDanhMucTaiSan;
};
const updateDanhMucTaiSan = async (id, data, user) => {
  const danhMucTaiSan = await DanhMucTaiSan.findByPk(id);
  if (!danhMucTaiSan) {
    return new Error("Danh mục tài sản không tồn tại");
  }
  await danhMucTaiSan.update(data);
  const value = {
    loai_hanh_dong: `Cập nhật danh mục tài sản :  ${data.ten}`,
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);

  return danhMucTaiSan;
};
const deleteDanhMucTaiSan = async (id, user) => {
  const danhMucTaiSan = await DanhMucTaiSan.findByPk(id);
  if (!danhMucTaiSan) {
    return new Error("Danh mục tài sản không tồn tại");
  }
  await danhMucTaiSan.destroy();
  const value = {
    loai_hanh_dong: `Xóa danh mục tài sản có id : ${id} và tên : ${danhMucTaiSan.ten}`,
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);
  return { message: "Danh mục tài sản đã được xóa thành công" };
};
module.exports = {
  getDanhMucTaiSan,
  addDanhMucTaiSan,
  updateDanhMucTaiSan,
  deleteDanhMucTaiSan,
  getAllDanhMucTaiSan,
};
