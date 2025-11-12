const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const { DanhMucTaiSan } = require("./danh_muc_tai_san");
const { NhaCungCap } = require("./nha_cung_cap");
const { LoaiTaiSan } = require("./loai_tai_san");
const TaiSan = sequelize.define(
  "TaiSan",
  {
    ten_tai_san: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    thong_tin: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    tong_so_luong: DataTypes.INTEGER,
    so_luong_con: DataTypes.INTEGER,
    type: DataTypes.BOOLEAN,
    ngay_dang_ky: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ngay_het_han: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    LoaiTaiSanId: {
      type: DataTypes.INTEGER,
      allowNull: true, // <-- Cho phép NULL
      references: {
        model: "loai_tai_san",
        key: "id",
      },
    },

    // Quan hệ với NhaCungCap (có thể null)
    NhaCungCapId: {
      type: DataTypes.INTEGER,
      allowNull: true, // <-- Cho phép NULL (bạn có thể đổi thành false nếu muốn)
      references: {
        model: "nha_cung_cap",
        key: "id",
      },
    },

    // Quan hệ với DanhMucTaiSan (có thể null)
    DanhMucTaiSanId: {
      type: DataTypes.INTEGER,
      allowNull: true, // <-- Cho phép NULL (bạn có thể đổi thành false nếu muốn)
      references: {
        model: "danh_muc_tai_san",
        key: "id",
      },
    },
  },
  {
    tableName: "tai_san",
    timestamps: false,
  }
);

NhaCungCap.hasMany(TaiSan, { foreignKey: "NhaCungCapId" });
TaiSan.belongsTo(NhaCungCap, { foreignKey: "NhaCungCapId" });

// Quan hệ còn lại của TaiSan
LoaiTaiSan.hasMany(TaiSan, { foreignKey: "LoaiTaiSanId" });
TaiSan.belongsTo(LoaiTaiSan, { foreignKey: "LoaiTaiSanId" });

DanhMucTaiSan.hasMany(TaiSan, { foreignKey: "DanhMucTaiSanId" });
TaiSan.belongsTo(DanhMucTaiSan, { foreignKey: "DanhMucTaiSanId" });

module.exports = { TaiSan };
