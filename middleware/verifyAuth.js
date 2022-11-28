const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { status } = require('../helpers/status');
const { User } = require('../models');

dotenv.config();

/**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */

const verifyTokenAdmin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(status.unauthorized).send({
      status: 'unauthorized',
      message: 'Token non fourni',
    });
  }
  const token = authorization.split('Bearer ')[1];
  if (!token) {
    return res.status(status.unauthorized).send({
      status: 'unauthorized',
      message: 'Token non fourni',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      return res.status(status.unauthorized).send({
        status: 'unauthorized',
        message: 'Aucun utilisateur trouvé',
        name: 'NoUserWithToken',
      });
    }

    if (user.token !== token) {
      return res.status(status.unauthorized).send({
        status: 'unauthorized',
        message: 'Ce Token n\'appartient pas à cette utisateur',
        name: 'NoUserWithToken',
      });
    }

    if (!decoded.is_admin) {
      return res.status(status.unauthorized).send({
        status: 'unauthorized',
        message: 'Seul l\'administrateur peur effectuer cette action',
        name: 'NotAdmin',
      });
    }

    req.user = {
      email: decoded.email,
      user_id: decoded.user_id,
      is_admin: decoded.is_admin,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
    };

    next();
    return true;
  } catch (error) {
    return res.status(status.unauthorized).send({
      status: 'error',
      message: error.message,
      name: error.name,
    });
  }
};

const verifyTokenUser = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(status.unauthorized).send({
      status: 'unauthorized',
      message: 'Token non fourni',
    });
  }
  const token = authorization.split('Bearer ')[1];
  if (!token) {
    return res.status(status.unauthorized).send({
      status: 'unauthorized',
      message: 'Token non fourni',
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      return res.status(status.unauthorized).send({
        status: 'unauthorized',
        message: 'Aucun utilisateur trouvé',
        name: 'NoUserWithToken',
      });
    }

    if (user.token !== token) {
      return res.status(status.unauthorized).send({
        status: 'unauthorized',
        message: 'Ce Token n\'appartient à cette utisateur',
      });
    }

    req.user = {
      email: decoded.email,
      user_id: decoded.user_id,
      is_admin: decoded.is_admin,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
    };
    next();
    return true;
  } catch (error) {
    return res.status(status.unauthorized).send({
      status: 'error',
      message: error.message,
      name: error.name,
    });
  }
};

module.exports = {
  verifyTokenAdmin,
  verifyTokenUser,
};
