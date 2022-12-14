const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database_url: process.env.DATABASE_URL,
  // test_database_url: process.env.TEST_DATABASE_URL,
  // secret: process.env.SECRET,
  port: process.env.PORT || 5000,
  // environment: process.env.NODE_ENV,
  // hom: process.env.HOM,
  // pom: process.env.POM,
  // usm: process.env.USM,
  // pam: process.env.PAM,
};
