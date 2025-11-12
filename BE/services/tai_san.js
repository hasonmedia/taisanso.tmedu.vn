const { TaiSan } = require("../model/tai_san");
const { HanhDong } = require("../model/hanh_dong");
const { sequelize } = require("../config/database");
const { ChiTietHanhDong } = require("../model/chi_tiet_hanh_dong");
const { DanhMucTaiSan } = require("../model/danh_muc_tai_san");
const { NhaCungCap } = require("../model/nha_cung_cap");
const { LoaiTaiSan } = require("../model/loai_tai_san");
const getTaiSan = async (data, user) => {
  const page = parseInt(data.page) || 1;
  const limit = parseInt(data.limit) || 10;
  const offset = (page - 1) * limit;
  const getAll = data.getAll === "true";
  const search = data.search ? data.search.trim() : null;
  let filter = ``;
  let DanhMucTaiSan1 = null;

  // Filter by category
  if (data.idDanhMucTaiSan) {
    DanhMucTaiSan1 = await DanhMucTaiSan.findByPk(data.idDanhMucTaiSan);
    filter = `WHERE ts.danh_muc_tai_san_id = ${data.idDanhMucTaiSan}`;
  }

  // Filter by asset type
  if (data.idLoaiTaiSan) {
    const loaiTaiSanCondition = `ts.loai_tai_san_id = ${data.idLoaiTaiSan}`;
    filter += filter
      ? ` AND ${loaiTaiSanCondition}`
      : `WHERE ${loaiTaiSanCondition}`;
  }

  // Filter by supplier
  if (data.idNhaCungCap) {
    const nhaCungCapCondition = `ts.nha_cung_cap_id = ${data.idNhaCungCap}`;
    filter += filter
      ? ` AND ${nhaCungCapCondition}`
      : `WHERE ${nhaCungCapCondition}`;
  }

  // Search filter
  if (search) {
    const searchCondition = `
      (ts.ten_tai_san ILIKE '%${search}%')
    `;
    filter += filter ? ` AND ${searchCondition}` : `WHERE ${searchCondition}`;
  }

  const countSql = `
    SELECT COUNT(*) AS total
    FROM tai_san AS ts
    ${filter};
  `;
  const countResult = await sequelize.query(countSql, {
    type: sequelize.QueryTypes.SELECT,
  });
  const total = countResult[0].total;

  // 2. Tạo chuỗi SQL cho phân trang một cách có điều kiện
  const paginationSql = getAll ? "" : `LIMIT ${limit} OFFSET ${offset}`;

  const sql = `
    SELECT 
        ts.*,
        danhMucTaiSan.id AS danh_muc_tai_san_id,
        danhMucTaiSan.ghi_chu AS ghi_chu,
        ncc.id AS nha_cung_cap_id,
        ncc.ten AS ten_nha_cung_cap,
        ncc.sodienthoai AS lien_he_nha_cung_cap,
        ncc.lienhe AS lien_he,
        ncc.website AS website,
        ncc.ghi_chu AS ghi_chu_nha_cung_cap,
        lts.id AS loai_tai_san_id,
        lts.ten AS loai_tai_san_ten
    FROM 
        tai_san AS ts
    JOIN 
        danh_muc_tai_san AS danhMucTaiSan ON danhMucTaiSan.id = ts.danh_muc_tai_san_id
    JOIN
        nha_cung_cap AS ncc ON ncc.id = ts.nha_cung_cap_id
    LEFT JOIN
        loai_tai_san AS lts ON lts.id = ts.loai_tai_san_id
    ${filter}
    ${paginationSql};  -- 3. Sử dụng chuỗi phân trang ở đây
  `;

  const results = await sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });

  let moTaHanhDong = "Lấy danh sách tài sản";
  let filters = [];

  if (data.idDanhMucTaiSan && DanhMucTaiSan1) {
    filters.push(`danh mục: ${DanhMucTaiSan1.ten}`);
  }
  if (data.idLoaiTaiSan) {
    filters.push(`loại tài sản ID: ${data.idLoaiTaiSan}`);
  }
  if (data.idNhaCungCap) {
    filters.push(`nhà cung cấp ID: ${data.idNhaCungCap}`);
  }
  if (search) {
    filters.push(`tìm kiếm: "${search}"`);
  }

  if (filters.length > 0) {
    moTaHanhDong += ` với bộ lọc: ${filters.join(", ")}`;
  }

  await ChiTietHanhDong.create({
    loai_hanh_dong: moTaHanhDong,
    HanhDongId: user.hanh_dong,
  });

  // 4. Cập nhật thông tin trả về
  return {
    data: results,
    total,
    page: getAll ? 1 : page,
    limit: getAll ? total : limit, // Nếu 'getAll', limit bằng 'total'
    totalPages: getAll ? 1 : Math.ceil(total / limit),
  };
};

const addTaiSan = async (data, user) => {
  try {
    const newTaiSan = await TaiSan.create(data);
    const value = {
      loai_hanh_dong: `Thêm tài sản mới có tên là ${data.ten_tai_san} và nhà cung cấp là ${data.ten_nha_cung_cap}`,
      HanhDongId: user.hanh_dong,
    };
    await ChiTietHanhDong.create(value);
    return newTaiSan;
  } catch (error) {
    console.log("Lỗi khi thêm tài sản:", error);
  }
};
const updateTaiSan = async (id, data, user) => {
  const taiSan = await TaiSan.findByPk(id);
  if (!taiSan) {
    return new Error("Tài sản không tồn tại");
  }
  await taiSan.update(data);
  const value = {
    loai_hanh_dong: `Cập nhật tài sản có tên là ${data.ten_tai_san} và nhà cung cấp là ${data.ten_nha_cung_cap}`,
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);
  return taiSan;
};
const deleteTaiSan = async (id, user) => {
  const taiSan = await TaiSan.findByPk(id);
  const ten_tai_san = taiSan.ten_tai_san;
  if (!taiSan) {
    return new Error("Tài sản không tồn tại");
  }
  await taiSan.destroy();
  const value = {
    loai_hanh_dong: `Xóa tài sản ${ten_tai_san}`,
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);
  return { message: "Tài sản đã được xóa thành công" };
};

const getTaiSanSapHetHan = async (user) => {
  const today = new Date();
  const tenDaysFromNow = new Date(today);
  tenDaysFromNow.setDate(today.getDate() + 10);

  const sql = `SELECT 
                    ts.*,
                    danhMucTaiSan.id AS danh_muc_tai_san_id,
                    danhMucTaiSan.ghi_chu AS ghi_chu,
                    ncc.id AS nha_cung_cap_id,
                    ncc.ten AS ten_nha_cung_cap,
                    lts.id AS loai_tai_san_id,
                    lts.ten AS loai_tai_san_ten,
                    CASE
                        WHEN (ts.ngay_het_han - CURRENT_DATE) < 0 THEN 'expired'
                        WHEN (ts.ngay_het_han - CURRENT_DATE) <= 3 THEN 'critical'
                        WHEN (ts.ngay_het_han - CURRENT_DATE) <= 7 THEN 'warning'
                        WHEN (ts.ngay_het_han - CURRENT_DATE) <= 10 THEN 'notice'
                        WHEN (ts.ngay_het_han - CURRENT_DATE) <= 30 THEN 'upcoming'
                        ELSE 'normal'
                    END AS muc_do_canh_bao,
                    (ts.ngay_het_han - CURRENT_DATE) AS so_ngay_con_lai
                FROM 
                    tai_san AS ts
                JOIN 
                    danh_muc_tai_san AS danhMucTaiSan 
                    ON danhMucTaiSan.id = ts.danh_muc_tai_san_id
                JOIN
                    nha_cung_cap AS ncc ON ncc.id = ts.nha_cung_cap_id
                LEFT JOIN
                    loai_tai_san AS lts ON lts.id = ts.loai_tai_san_id
                WHERE 
                    ts.ngay_het_han IS NOT NULL
                    AND ts.ngay_het_han <= (CURRENT_DATE + INTERVAL '30 days')
                ORDER BY 
                    ts.ngay_het_han ASC;
`;

  const results = await sequelize.query(sql, {
    type: sequelize.QueryTypes.SELECT,
  });
  const expiredAssets = results.filter((asset) => asset.so_ngay_con_lai < 0);
  // Phân loại theo mức độ cảnh báo
  const criticalAssets = results.filter((asset) => asset.so_ngay_con_lai <= 3);
  const warningAssets = results.filter(
    (asset) => asset.so_ngay_con_lai > 3 && asset.so_ngay_con_lai <= 7
  );
  const noticeAssets = results.filter(
    (asset) => asset.so_ngay_con_lai > 7 && asset.so_ngay_con_lai <= 10
  );
  const upcomingAssets = results.filter(
    (asset) => asset.so_ngay_con_lai > 10 && asset.so_ngay_con_lai <= 30
  );
  // Ghi log hành động
  const value = {
    loai_hanh_dong: `Kiểm tra tài sản sắp hết hạn - Tìm thấy ${results.length} tài sản cần chú ý`,
    HanhDongId: user.hanh_dong,
  };
  await ChiTietHanhDong.create(value);

  return {
    total: results.length,
    expired: {
      count: expiredAssets.length,
      message: "Tài sản đã hết hạn",
      assets: expiredAssets,
    },
    critical: {
      count: criticalAssets.length,
      message: "Tài sản hết hạn trong 3 ngày hoặc ít hơn",
      assets: criticalAssets,
    },
    warning: {
      count: warningAssets.length,
      message: "Tài sản hết hạn trong 4-7 ngày",
      assets: warningAssets,
    },
    notice: {
      count: noticeAssets.length,
      message: "Tài sản hết hạn trong 8-10 ngày",
      assets: noticeAssets,
    },
    upcoming: {
      count: upcomingAssets.length,
      message: "Tài sản hết hạn trong 11-30 ngày",
      assets: upcomingAssets,
    },
    all_assets: results,
  };
};
const getTaiSanDetailsService = async (nhaCungCapIds = []) => {
  let subQueryWhere = `"ts_sub"."danh_muc_tai_san_id" = "DanhMucTaiSan"."id"`;
  const replacements = {};
  const isFiltering = nhaCungCapIds.length > 0;
  if (isFiltering) {
    subQueryWhere += ` AND "ts_sub"."nha_cung_cap_id" IN (:nhaCungCapIds)`;
    replacements.nhaCungCapIds = nhaCungCapIds;
  }

  const hetHanSubQuery = `(
    SELECT COUNT(*)
    FROM "tai_san" AS "ts_sub"
    WHERE ${subQueryWhere}
    AND "ts_sub"."ngay_het_han" < CURRENT_DATE
  )`;

  const sapHetHanSubQuery = `(
    SELECT COUNT(*)
    FROM "tai_san" AS "ts_sub"
    WHERE ${subQueryWhere}
    AND "ts_sub"."ngay_het_han" >= CURRENT_DATE
    AND ("ts_sub"."ngay_het_han"::date - CURRENT_DATE::date) <= 30
  )`;

  const taiSanIncludeOptions = {
    model: TaiSan,
    as: "TaiSans",
    attributes: [
      "id",
      "ten_tai_san",
      "thong_tin",
      "ngay_dang_ky",
      "ngay_het_han",
      [
        sequelize.literal(
          `("TaiSans"."ngay_het_han"::date - CURRENT_DATE::date)`
        ),
        "so_ngay_con_lai",
      ],
      [
        sequelize.literal(`
        (CASE
          WHEN "TaiSans"."ngay_het_han" < CURRENT_DATE THEN 'expired'
          WHEN ("TaiSans"."ngay_het_han"::date - CURRENT_DATE::date) <= 3 THEN 'critical'
          WHEN ("TaiSans"."ngay_het_han"::date - CURRENT_DATE::date) <= 7 THEN 'warning'
          WHEN ("TaiSans"."ngay_het_han"::date - CURRENT_DATE::date) <= 10 THEN 'notice'
          WHEN ("TaiSans"."ngay_het_han"::date - CURRENT_DATE::date) <= 30 THEN 'upcoming'
          ELSE 'safe'
        END)`),
        "muc_do_canh_bao",
      ],
    ],
    include: [
      {
        model: NhaCungCap,
        attributes: ["id", "ten"],
        required: true,
        ...(isFiltering && { where: { id: nhaCungCapIds } }),
      },
      {
        model: LoaiTaiSan,
        attributes: ["id", "ten"],
        required: false,
      },
    ],
    required: false,
  };

  try {
    const results = await DanhMucTaiSan.findAll({
      attributes: [
        "id",
        "ten",
        "ghi_chu",
        [sequelize.literal(hetHanSubQuery), "so_luong_het_han"],
        [sequelize.literal(sapHetHanSubQuery), "so_luong_sap_het_han"],
      ],
      include: [taiSanIncludeOptions],
      order: [["ten", "ASC"]],
      distinct: true,
      replacements,
    });

    return results;
  } catch (error) {
    console.error("Lỗi khi lấy tài sản theo nhóm (có đếm):", error);
    throw error;
  }
};

module.exports = {
  getTaiSan,
  addTaiSan,
  updateTaiSan,
  deleteTaiSan,
  getTaiSanSapHetHan,
  getTaiSanDetailsService,
};
