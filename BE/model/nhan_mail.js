const { DataTypes } = require("sequelize");
const {sequelize} = require("../config/database"); 

const nhan_mail = sequelize.define('NhanMail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: "nhan_mail",
  timestamps: false
});

module.exports = nhan_mail;
