const { Sequelize } = require("sequelize")
const env = require("../env")

const sequelize = new Sequelize(env.database_url)

module.exports = {
  sequelize,
}
