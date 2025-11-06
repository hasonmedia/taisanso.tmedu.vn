const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const NhaCungCap = sequelize.define(
  "NhaCungCap",
  {
    ten: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    lienhe: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    sodienthoai: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "nha_cung_cap",
    timestamps: false,
  }
);
module.exports = { NhaCungCap };
