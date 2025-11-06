const {
  getNhaCungCap,
  addNhaCungCap,
  updateNhaCungCap,
  deleteNhaCungCap,
} = require("../services/nha_cung_cap");

const getNhaCungCapController = async (req, res) => {
  try {
    const idArray = req.query["danhmucIds[]"];
    const results = await getNhaCungCap(idArray);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNhaCungCapController = async (req, res) => {
  try {
    const newNhaCungCap = await addNhaCungCap(req.body);
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
    if (result instanceof Error) {
      return res.status(404).json({ error: result.message });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getNhaCungCapController,
  addNhaCungCapController,
  updateNhaCungCapController,
  deleteNhaCungCapController,
};
