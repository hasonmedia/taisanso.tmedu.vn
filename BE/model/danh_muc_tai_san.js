const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { LoaiTaiSan } = require("./loai_tai_san");
const DanhMucTaiSan = sequelize.define(
  "DanhMucTaiSan",
  {
    // 'id' sẽ được Sequelize tự động thêm làm khóa chính
    ten: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    ghi_chu: DataTypes.TEXT,
  },
  {
    tableName: "danh_muc_tai_san",
    timestamps: false,
  }
);
DanhMucTaiSan.hasMany(LoaiTaiSan, { foreignKey: "DanhMucTaiSanId" });
LoaiTaiSan.belongsTo(DanhMucTaiSan, { foreignKey: "DanhMucTaiSanId" });
module.exports = { DanhMucTaiSan };
