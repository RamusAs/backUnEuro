const { DataTypes } = require('sequelize');

module.exports = {
  name: { type: DataTypes.STRING },
  mail: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT },
  read: { type: DataTypes.BOOLEAN, defaultValue: false }
};
