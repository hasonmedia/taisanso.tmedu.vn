const { NhaCungCap } = require("../model/nha_cung_cap");
const { TaiSan } = require("../model/tai_san");
const getNhaCungCap = async (filter) => {
  const danhMucIds = filter["danhmucId[]"];

  const taiSanInclude = {
    model: TaiSan,
    as: "TaiSans",
  };

  let finalOptions = {
    include: [taiSanInclude],
    order: [["ten", "ASC"]],

    distinct: true,
  };

  if (danhMucIds && danhMucIds.length > 0) {
    taiSanInclude.where = {
      danh_muc_tai_san_id: danhMucIds,
    };
    taiSanInclude.required = true;
  }

  const nhaCungCaps = await NhaCungCap.findAll(finalOptions);

  return nhaCungCaps;
};
const addNhaCungCap = async (data) => {
  try {
    const check = await NhaCungCap.findOne({
      where: {
        ten: data.ten,
      },
    });

    if (check) {
      return { success: false, error: "Tên nhà cung cấp đã tồn tại" };
    }
    const newNhaCungCap = await NhaCungCap.create(data);
    return { success: true, data: newNhaCungCap };
  } catch (error) {
    console.error("Error while adding NhaCungCap:", error);
    return { success: false, error: "Lỗi hệ thống khi thêm nhà cung cấp" };
  }
};
const updateNhaCungCap = async (id, data) => {
  const nhaCungCap = await NhaCungCap.findByPk(id);
  if (!nhaCungCap) {
    return new Error("Nhà cung cấp không tồn tại");
  }
  await nhaCungCap.update(data);
  return nhaCungCap;
};
const deleteNhaCungCap = async (id) => {
  const nhaCungCap = await NhaCungCap.findByPk(id);
  if (!nhaCungCap) {
    return {
      success: false,
      message: "Nhà cung cấp không tồn tại",
    };
  }

  const ten_nha_cung_cap = nhaCungCap.ten;

  // Kiểm tra xem có tài sản nào đang sử dụng nhà cung cấp này không
  const taiSanCount = await TaiSan.count({
    where: { NhaCungCapId: id },
  });

  if (taiSanCount > 0) {
    return {
      success: false,
      message: `Không thể xóa nhà cung cấp ${ten_nha_cung_cap} vì đang có ${taiSanCount} tài sản liên quan.`,
    };
  }

  await nhaCungCap.destroy();
  return {
    success: true,
    message: `Nhà cung cấp ${ten_nha_cung_cap} đã được xóa thành công`,
  };
};

module.exports = {
  getNhaCungCap,
  addNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
};
