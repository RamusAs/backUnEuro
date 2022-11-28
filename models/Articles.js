const { DataTypes, Utils } = require('sequelize');
createTheNewDataType();


function createTheNewDataType() {
  class ETAT extends DataTypes.INTEGER {
    toSql() {
      return 'INTEGER'
    }

    _sanitize(value) {
      // Force all numbers to be > 0 && < 6
      return (value > 0 && value < 6) ? value : (Math.round(value) % 6);
    }
  }
  ETAT.prototype.key = ETAT.key = 'ETAT';
  DataTypes.ETAT = Utils.classToInvokable(ETAT);
}

module.exports = {
  idCat: { type: DataTypes.INTEGER, allowNull: false },
  img: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  etat: {type : DataTypes.ETAT, defaultValue: 1 },
  desc: { type: DataTypes.TEXT, allowNull: false },
  price: { type: DataTypes.DOUBLE, defaultValue: 1 },
  authorName: { type: DataTypes.STRING, defaultValue: 'unEuro' },
  authorContact: {type: DataTypes.STRING}
};