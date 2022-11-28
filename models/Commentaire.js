const { DataTypes } = require('sequelize');

module.exports = {
  idBlog: { type: DataTypes.INTEGER, allowNull: false},
  name: { type: DataTypes.STRING, allowNull: false},
  mail: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT, allowNull: false },
};
