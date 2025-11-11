const { LoaiTaiSan } = require("../model/loai_tai_san");
const { TaiSan } = require("../model/tai_san");
const { NhaCungCap } = require("../model/nha_cung_cap");
const { Op } = require("sequelize");

const getLoaiTaiSanService = async ({
  page = 1,
  limit = 10,
  search,
  nhaCungCapId,
}) => {
  try {
    const offset = (page - 1) * limit;
    const whereClause = {};

    if (search) {
      whereClause.ten = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (nhaCungCapId) {
      whereClause.NhaCungCapId = nhaCungCapId;
    }

    const { count, rows } = await LoaiTaiSan.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: NhaCungCap,
          attributes: ["id", "ten", "website", "lienhe", "sodienthoai"],
          include: [
            {
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
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["ten", "ASC"]],
    });
    const groupedData = rows.reduce((acc, item) => {
      const nhaCungCaps = item.dataValues.NhaCungCap
        ? [
            {
              id: item.dataValues.NhaCungCap.id,
              ten: item.dataValues.NhaCungCap.ten,
              website: item.dataValues.NhaCungCap.website,
              taiSans: item.dataValues.NhaCungCap.TaiSans || [],
            },
          ]
        : [];

      const existing = acc.find((i) => i.ten === item.ten);

      if (existing) {
        nhaCungCaps.forEach((ncc) => {
          if (!existing.nhaCungCaps.some((e) => e.id === ncc.id)) {
            existing.nhaCungCaps.push(ncc);
          }
        });
      } else {
        acc.push({
          ten: item.ten,
          id: item.id,
          nhaCungCaps,
        });
      }

      return acc;
    }, []);

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: groupedData,
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

const addLoaiTaiSanService = async ({ ten, nhaCungCapId }) => {
  try {
    // Kiểm tra nhà cung cấp có tồn tại không
    const nhaCungCap = await NhaCungCap.findByPk(nhaCungCapId);
    if (!nhaCungCap) {
      throw new Error("Nhà cung cấp không tồn tại");
    }

    const loaiTaiSan = await LoaiTaiSan.create({
      ten: ten.trim(),
      NhaCungCapId: nhaCungCapId,
    });

    // Trả về kèm thông tin nhà cung cấp
    return await LoaiTaiSan.findByPk(loaiTaiSan.id, {
      include: [
        {
          model: NhaCungCap,
          attributes: ["id", "ten", "website"],
        },
      ],
    });
  } catch (error) {
    console.error("Error in addLoaiTaiSanService:", error);
    throw error;
  }
};

// Cập nhật loại tài sản
const updateLoaiTaiSanService = async (id, { ten, nhaCungCapId }) => {
  try {
    const loaiTaiSan = await LoaiTaiSan.findByPk(id);
    if (!loaiTaiSan) {
      return null;
    }

    const updateData = { ten: ten.trim() };

    // Nếu có cập nhật nhà cung cấp, kiểm tra tồn tại
    if (nhaCungCapId) {
      const nhaCungCap = await NhaCungCap.findByPk(nhaCungCapId);
      if (!nhaCungCap) {
        throw new Error("Nhà cung cấp không tồn tại");
      }
      updateData.NhaCungCapId = nhaCungCapId;
    }

    await loaiTaiSan.update(updateData);

    // Trả về kèm thông tin nhà cung cấp
    return await LoaiTaiSan.findByPk(id, {
      include: [
        {
          model: NhaCungCap,
          attributes: ["id", "ten", "website"],
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
