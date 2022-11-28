const { DataTypes, STRING } = require('sequelize');

module.exports = {
  auteur: { type: DataTypes.STRING, allowNull: false}, 
  title: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING },
  subtitle: { type: DataTypes.STRING },
  texte: { type: DataTypes.TEXT, allowNull: false },
};
