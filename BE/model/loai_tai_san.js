const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");
const { NhaCungCap } = require("./nha_cung_cap");

const LoaiTaiSan = sequelize.define(
  "LoaiTaiSan",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ten: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Khóa ngoại, quan hệ "con" với DanhMucTaiSan
    DanhMucTaiSanId: {
      type: DataTypes.INTEGER,
      allowNull: false, // Loại tài sản phải thuộc 1 danh mục
      references: {
        model: "danh_muc_tai_san",
        key: "id",
      },
    },
  },
  {
    tableName: "loai_tai_san",
    timestamps: false,
  }
);
module.exports = { LoaiTaiSan };
