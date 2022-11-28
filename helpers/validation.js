const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../env');

/**
   * Hash Password Method
   * @param {string} password
   * @returns {string} returns hashed password
   */
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassword = (password) => bcrypt.hashSync(password, salt);

/**
 * comparePassword
 * @param {string} hashPassword
 * @param {string} password
 * @returns {Boolean} return True or False
 */
const comparePassword = (hashedPassword, password) => bcrypt.compareSync(password, hashedPassword);

/**
   * isValidEmail helper method
   * @param {string} email
   * @returns {Boolean} True or False
   */
const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/**
   * isValidContact helper method
   * @param {string} contact
   * @returns {Boolean} True or False
   */
const isValidContact = (contact) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(contact);
};

/**
   * validatePassword helper method
   * @param {string} password
   * @returns {Boolean} True or False
   */
const validatePassword = (password) => {
  if (password.length <= 7 || password === '') {
    return false;
  } return true;
};
/**
   * isEmpty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const isEmpty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  if (input.replace(/\s/g, '').length) {
    return false;
  } return true;
};

/**
   * empty helper method
   * @param {string, integer} input
   * @returns {Boolean} True or False
   */
const empty = (input) => {
  if (input === undefined || input === '') {
    return true;
  }
  return false;
};

/**
 * Generate Token
 * @param {string} id
 * @returns {string} token
 */
const generateUserToken = (email, id, is_admin, first_name, last_name) => {
  console.log({
    email,
    user_id: id,
    is_admin,
    first_name,
    last_name,
  });
  token = jwt.sign({
    email,
    user_id: id,
    is_admin,
    first_name,
    last_name,
  },
  env.secret, { expiresIn: '3d' });
  console.log(token);
  return token;
};

module.exports = {
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  isValidContact,
  generateUserToken,
  hashPassword,
  comparePassword,
};
