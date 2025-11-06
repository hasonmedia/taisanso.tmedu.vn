const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const { DanhMucTaiSan } = require("./danh_muc_tai_san");
const { NhaCungCap } = require("./nha_cung_cap");

//tai_san
const TaiSan = sequelize.define(
  "TaiSan",
  {
    ten_tai_san: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // thông tin động
    thong_tin: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    tong_so_luong: DataTypes.INTEGER,
    so_luong_con: DataTypes.INTEGER,
    type: DataTypes.BOOLEAN,

    // thêm 2 trường ngày
    ngay_dang_ky: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ngay_het_han: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "tai_san",
    timestamps: false,
  }
);

TaiSan.belongsTo(DanhMucTaiSan);
DanhMucTaiSan.hasMany(TaiSan);

TaiSan.belongsTo(NhaCungCap);
NhaCungCap.hasMany(TaiSan);

module.exports = { TaiSan };
