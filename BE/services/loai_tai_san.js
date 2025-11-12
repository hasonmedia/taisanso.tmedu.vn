const { LoaiTaiSan } = require("../model/loai_tai_san");
const { TaiSan } = require("../model/tai_san");
const { NhaCungCap } = require("../model/nha_cung_cap");
const { DanhMucTaiSan } = require("../model/danh_muc_tai_san");
const { Op } = require("sequelize");
const getLoaiTaiSanService = async ({
  page = 1,
  limit = 10,
  search,
  danhMucTaiSanId,
}) => {
  try {
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause.ten = {
        [Op.iLike]: `%${search}%`,
      };
    }
    if (danhMucTaiSanId) {
      whereClause.DanhMucTaiSanId = danhMucTaiSanId; // <-- Sử dụng tên đúng
    }

    // 3. Lấy dữ liệu và đếm
    const { count, rows } = await LoaiTaiSan.findAndCountAll({
      where: whereClause, // whereClause đã chứa bộ lọc danhMucTaiSanId
      include: [
        {
          // Vẫn include để lấy thông tin
          model: DanhMucTaiSan,
          attributes: ["id", "ten", "ghi_chu"],
        },
        {
          // Vẫn include để lấy danh sách TaiSan lồng nhau
          model: TaiSan,
          attributes: [
            "id",
            "ten_tai_san",
            "thong_tin",
            "tong_so_luong",
            "so_luong_con",
            "ngay_dang_ky",
            "ngay_het_han",
          ],
          include: [
            {
              model: NhaCungCap,
              attributes: ["id", "ten", "website", "lienhe", "sodienthoai"],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["ten", "ASC"]],
      distinct: true,
    });

    const totalPages = Math.ceil(count / limit);

    // 4. Trả về kết quả
    return {
      success: true,
      data: rows,
      pagination: {
        current_page: parseInt(page),
        total_pages: totalPages,
        total_records: count,
        per_page: parseInt(limit),
      },
    };
  } catch (error) {
    console.error("Error in getLoaiTaiSanService:", error);
    throw error;
  }
};

const addLoaiTaiSanService = async ({ ten, danhMucTaiSanId }) => {
  try {
    const danh_muc_tai_san = await DanhMucTaiSan.findByPk(danhMucTaiSanId);
    if (!danh_muc_tai_san) {
      throw new Error("Danh mục tài sản không tồn tại");
    }

    const loaiTaiSan = await LoaiTaiSan.create({
      ten: ten.trim(),
      DanhMucTaiSanId: danhMucTaiSanId,
    });

    // Trả về kèm thông tin danh mục tài sản
    return await LoaiTaiSan.findByPk(loaiTaiSan.id, {
      include: [
        {
          model: DanhMucTaiSan,
          attributes: ["id", "ten", "ghi_chu"],
        },
      ],
    });
  } catch (error) {
    console.error("Error in addLoaiTaiSanService:", error);
    throw error;
  }
};

// Cập nhật loại tài sản
const updateLoaiTaiSanService = async (id, { ten, danhMucTaiSanId }) => {
  try {
    const loaiTaiSan = await LoaiTaiSan.findByPk(id);
    if (!loaiTaiSan) {
      return null;
    }

    const updateData = { ten: ten.trim() };

    // Nếu có cập nhật danh mục tài sản, kiểm tra tồn tại
    if (danhMucTaiSanId) {
      const danhmucts = await DanhMucTaiSan.findByPk(danhMucTaiSanId);
      if (!danhmucts) {
        throw new Error("Danh mục tài sản không tồn tại");
      }
      updateData.DanhMucTaiSanId = danhMucTaiSanId;
    }

    await loaiTaiSan.update(updateData);

    // Trả về kèm thông tin danh mục tài sản
    return await LoaiTaiSan.findByPk(id, {
      include: [
        {
          model: DanhMucTaiSan,
          attributes: ["id", "ten", "ghi_chu"],
        },
      ],
    });
  } catch (error) {
    console.error("Error in updateLoaiTaiSanService:", error);
    throw error;
  }
};

// Xóa loại tài sản
const deleteLoaiTaiSanService = async (id) => {
  try {
    const loaiTaiSan = await LoaiTaiSan.findByPk(id);
    if (!loaiTaiSan) {
      return {
        success: false,
        message: "Không tìm thấy loại tài sản",
      };
    }

    // Kiểm tra xem có tài sản nào đang sử dụng loại tài sản này không
    const taiSanCount = await TaiSan.count({
      where: { LoaiTaiSanId: id },
    });

    if (taiSanCount > 0) {
      return {
        success: false,
        message: `Không thể xóa vì còn ${taiSanCount} tài sản đang sử dụng loại tài sản này`,
      };
    }

    const deletedData = loaiTaiSan.toJSON();
    await loaiTaiSan.destroy();

    return {
      success: true,
      message: "Xóa loại tài sản thành công",
      deletedData,
    };
  } catch (error) {
    console.error("Error in deleteLoaiTaiSanService:", error);
    throw error;
  }
};

module.exports = {
  getLoaiTaiSanService,
  addLoaiTaiSanService,
  updateLoaiTaiSanService,
  deleteLoaiTaiSanService,
};
