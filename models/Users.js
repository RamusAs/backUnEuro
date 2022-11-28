const { DataTypes } = require('sequelize');

module.exports = {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  is_admin: { type: DataTypes.BOOLEAN, allowNull: false },
  is_connected: { type: DataTypes.BOOLEAN, allowNull: false },
  token: { type: DataTypes.TEXT, allowNull: true },
};
