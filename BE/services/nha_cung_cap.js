const { NhaCungCap } = require("../model/nha_cung_cap");
const { TaiSan } = require("../model/tai_san");
const { Op } = require("sequelize");
const getNhaCungCap = async (danhmucIds = []) => {
  if (!Array.isArray(danhmucIds)) {
    danhmucIds = [danhmucIds];
  }
  const taiSanInclude = {
    model: TaiSan,
    required: false,
  };
  if (Array.isArray(danhmucIds) && danhmucIds.length > 0) {
    taiSanInclude.where = {
      danh_muc_tai_san_id: { [Op.in]: danhmucIds },
    };
    taiSanInclude.required = true;
  }
  const options = {
    include: [taiSanInclude],
    distinct: true,
  };
  const nhaCungCaps = await NhaCungCap.findAll(options);
  return nhaCungCaps.map((item) => item.get({ plain: true }));
};
const addNhaCungCap = async (data) => {
  console.log("Data received for new NhaCungCap:", data);
  try {
    const newNhaCungCap = await NhaCungCap.create(data);
    return newNhaCungCap;
  } catch (error) {
    console.error("Error while adding NhaCungCap:", error);
    throw error;
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
  const ten_nha_cung_cap = nhaCungCap.ten;
  if (!nhaCungCap) {
    return new Error("Nhà cung cấp không tồn tại");
  }
  const taiSans = await TaiSan.findAll({ where: { NhaCungCapId: id } });
  if (taiSans.length > 0) {
    return new Error(
      `Không thể xóa nhà cung cấp ${ten_nha_cung_cap} vì đang có tài sản liên quan.`
    );
  }
  await nhaCungCap.destroy();
  return { message: `Nhà cung cấp ${ten_nha_cung_cap} đã được xóa thành công` };
};

module.exports = {
  getNhaCungCap,
  addNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
};
