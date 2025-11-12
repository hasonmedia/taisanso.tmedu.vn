const {
  getLoaiTaiSanService,
  addLoaiTaiSanService,
  updateLoaiTaiSanService,
  deleteLoaiTaiSanService,
} = require("../services/loai_tai_san");
// Lấy danh sách loại tài sản với phân trang
const getLoaiTaiSanController = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, danhMucTaiSanId } = req.query;

    const result = await getLoaiTaiSanService({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      danhMucTaiSanId: danhMucTaiSanId ? parseInt(danhMucTaiSanId) : null,
    });
    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in getLoaiTaiSanController:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách loại tài sản",
      error: error.message,
    });
  }
};

const addLoaiTaiSanController = async (req, res) => {
  try {
    const { ten, danhMucTaiSanId } = req.body;

    if (!ten) {
      return res.status(400).json({
        success: false,
        message: "Tên loại tài sản là bắt buộc",
      });
    }

    if (!danhMucTaiSanId) {
      return res.status(400).json({
        success: false,
        message: "Danh mục tài sản là bắt buộc",
      });
    }

    const result = await addLoaiTaiSanService({ ten, danhMucTaiSanId });

    // Log hoạt động
    // await logActivity({
    //   nguoi_dung_id: req.user.id,
    //   loai_hanh_dong: "CREATE_LOAI_TAI_SAN",
    //   mo_ta: `Tạo loại tài sản mới: ${ten} cho danh mục ID: ${danhMucTaiSanId}`,
    //   du_lieu_moi: result,
    //   ip_address: req.ip,
    //   user_agent: req.get("User-Agent"),
    // });

    res.status(201).json({
      success: true,
      message: "Thêm loại tài sản thành công",
      data: result,
    });
  } catch (error) {
    console.error("Error in addLoaiTaiSanController:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Loại tài sản này đã tồn tại cho danh mục được chọn",
      });
    }
    if (error.message === "Danh mục tài sản không tồn tại") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi khi thêm loại tài sản",
      error: error.message,
    });
  }
};

// Cập nhật loại tài sản
const updateLoaiTaiSanController = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten, danhMucTaiSanId } = req.body;

    if (!ten) {
      return res.status(400).json({
        success: false,
        message: "Tên loại tài sản là bắt buộc",
      });
    }

    const result = await updateLoaiTaiSanService(id, { ten, danhMucTaiSanId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy loại tài sản",
      });
    }

    // Log hoạt động
    // await logActivity({
    //   nguoi_dung_id: req.user.id,
    //   loai_hanh_dong: "UPDATE_LOAI_TAI_SAN",
    //   mo_ta: `Cập nhật loại tài sản ID: ${id}`,
    //   du_lieu_moi: result,
    //   ip_address: req.ip,
    //   user_agent: req.get("User-Agent"),
    // });

    res.status(200).json({
      success: true,
      message: "Cập nhật loại tài sản thành công",
      data: result,
    });
  } catch (error) {
    console.error("Error in updateLoaiTaiSanController:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        success: false,
        message: "Loại tài sản này đã tồn tại cho danh mục được chọn",
      });
    }
    if (error.message === "Danh mục tài sản không tồn tại") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật loại tài sản",
      error: error.message,
    });
  }
};

// Xóa loại tài sản
const deleteLoaiTaiSanController = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteLoaiTaiSanService(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    // Log hoạt động
    // await logActivity({
    //   nguoi_dung_id: req.user.id,
    //   loai_hanh_dong: "DELETE_LOAI_TAI_SAN",
    //   mo_ta: `Xóa loại tài sản ID: ${id}`,
    //   du_lieu_cu: result.deletedData,
    //   ip_address: req.ip,
    //   user_agent: req.get("User-Agent"),
    // });

    res.status(200).json({
      success: true,
      message: "Xóa loại tài sản thành công",
    });
  } catch (error) {
    console.error("Error in deleteLoaiTaiSanController:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa loại tài sản",
      error: error.message,
    });
  }
};

module.exports = {
  getLoaiTaiSanController,
  addLoaiTaiSanController,
  updateLoaiTaiSanController,
  deleteLoaiTaiSanController,
};
