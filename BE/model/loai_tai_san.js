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
    NhaCungCapId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "nha_cung_cap",
        key: "id",
      },
    },
  },
  {
    tableName: "loai_tai_san",
    timestamps: false,
  }
);

// Thiết lập quan hệ
LoaiTaiSan.belongsTo(NhaCungCap, { foreignKey: "NhaCungCapId" });
NhaCungCap.hasMany(LoaiTaiSan, { foreignKey: "NhaCungCapId" });

module.exports = { LoaiTaiSan };
