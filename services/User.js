const { User } = require('../models');
const Validations = require('../helpers/validation');
const { status } = require('../helpers/status');

const create = async (request, response) => {
  const data = {
    email: request.body.email,
    first_name: request.body.first_name,
    last_name: request.body.last_name,
    password: request.body.password,
  };

  let isOkay = true;
  const errors = [];

  Object.keys(data).forEach((key) => {
    if (Validations.isEmpty(data[key] === undefined ? undefined : `${data[key]}`)) {
      errors.push(`Le champs ${key} est vide ou inexistant`);
      isOkay = false;
    }
  });

  if (!isOkay) {
    return response.status(status.bad).send({
      status: 'bad',
      message: errors.join('\n'),
    });
  }

  if (!Validations.isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
    isOkay = false;
  }
  if (!Validations.validatePassword(data.password)) {
    errors.push('Le mot de passe entré doit au moins avoir 8 caractères');
    isOkay = false;
  }

  if (!isOkay) {
    return response.status(status.bad).send({
      status: 'bad',
      message: errors.join('\n'),
    });
  }

  try {
    const hashedPassword = Validations.hashPassword(data.password);
    const user = await User.create({
      ...data,
      password: hashedPassword,
      is_admin: false,
      is_connected: false,
    });
    const token = Validations.generateUserToken(
      user.email,
      user.id,
      user.is_admin,
      user.first_name,
      user.last_name,
    );
    user.is_connected = true;
    user.token = token;
    await user.save();
    delete user.dataValues.password;

    return response.status(status.created).json({
      status: 'created',
      message: 'Utilisateur créé avec succès',
      data: user.dataValues,
    });
  } catch (error) {
    return response.status(status.error).send({
      status: 'error',
      message: error.message,
      name: error.name,
    });
  }
};

const siginUser = async (request, response) => {
  const data = {
    email: request.body.email,
    password: request.body.password,
  };

  let isOkay = true;
  const errors = [];

  Object.keys(data).forEach((key) => {
    if (Validations.isEmpty(data[key] === undefined ? undefined : `${data[key]}`)) {
      errors.push(`Le champs ${key} est vide ou inexistant`);
      isOkay = false;
    }
  });

  if (!isOkay) {
    return response.status(status.bad).send({
      status: 'bad',
      message: errors.join('\n'),
    });
  }

  if (!Validations.isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
    isOkay = false;
  }
  if (!Validations.validatePassword(data.password)) {
    errors.push('Le mot de passe entré doit au moins avoir 8 caractères');
    isOkay = false;
  }

  if (!isOkay) {
    return response.status(status.bad).send({
      status: 'bad',
      message: errors.join('\n'),
    });
  }

  try {
    const user = await User.findOne({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return response.status(status.notfound).send({
        status: 'notfound',
        message: 'Aucun utilisateur avec cette email',
      });
    }
    if (!Validations.comparePassword(user.dataValues.password, data.password)) {
      return response.status(status.bad).send({
        status: 'bad',
        message: 'Mot de passe incorrect',
      });
    }

    const token = Validations.generateUserToken(
      user.email,
      user.id,
      user.is_admin,
      user.first_name,
      user.last_name,
    );

    user.is_connected = true;
    user.token = token;
    await user.save();
    delete user.dataValues.password;

    return response.status(status.success).json({
      status: 'success',
      message: 'Utilisateur connecté avec succès',
      data: user.dataValues,
    });
  } catch (error) {
    return response.status(status.error).send({
      status: 'error',
      message: error.message,
      name: error.name,
    });
  }
};

const sigoutUser = async (request, response) => {
  const data = {
    email: request.body.email,
  };

  let isOkay = true;
  const errors = [];

  Object.keys(data).forEach((key) => {
    if (Validations.isEmpty(data[key] === undefined ? undefined : `${data[key]}`)) {
      errors.push(`Le champs ${key} est vide ou inexistant`);
      isOkay = false;
    }
  });

  if (!isOkay) {
    return response.status(status.bad).send({
      status: 'bad',
      message: errors.join('\n'),
    });
  }

  if (!Validations.isValidEmail(data.email)) {
    errors.push('L\'email n\'est pas valide');
    isOkay = false;
  }

  if (!isOkay) {
    return response.status(status.bad).send({
      status: 'bad',
      message: errors.join('\n'),
    });
  }

  try {
    const user = await User.findOne({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return response.status(status.notfound).send({
        status: 'notfound',
        message: 'Aucun utilisateur avec cette email',
      });
    }
    user.is_connected = false;
    await user.save();
    return response.status(status.success).json({
      status: 'success',
      message: 'Deconnexion réussi',
    });
  } catch (error) {
    return response.status(status.error).send({
      status: 'error',
      message: error.message,
      name: error.name,
    });
  }
};

module.exports = {
  create,
  siginUser,
  sigoutUser,
};
