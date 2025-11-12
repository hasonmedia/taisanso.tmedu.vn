const {
  getNhaCungCap,
  addNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
} = require("../services/nha_cung_cap");

const getNhaCungCapController = async (req, res) => {
  try {
    const results = await getNhaCungCap(req.query);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNhaCungCapController = async (req, res) => {
  try {
    const newNhaCungCap = await addNhaCungCap(req.body);
    if (newNhaCungCap.success === false) {
      return res.status(400).json({
        status: false,
        message: newNhaCungCap.error,
      });
    }
    res.status(201).json(newNhaCungCap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNhaCungCapController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNhaCungCap = await updateNhaCungCap(id, req.body);
    if (updatedNhaCungCap instanceof Error) {
      return res.status(404).json({ error: updatedNhaCungCap.message });
    }
    res.status(200).json(updatedNhaCungCap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNhaCungCapController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteNhaCungCap(id);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa nhà cung cấp",
      error: error.message,
    });
  }
};

module.exports = {
  getNhaCungCapController,
  addNhaCungCapController,
  updateNhaCungCapController,
  deleteNhaCungCapController,
};
