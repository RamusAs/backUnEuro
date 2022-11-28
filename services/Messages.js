const { Op } = require('sequelize');
const { Message } = require('../models');
const Validations = require('../helpers/validation');
const Status = require('../helpers/status');

const create = async (request, response) => {
  const data = {
    name: request.body.name,
    mail: request.body.mail,
    message: request.body.message,
    read: request.body.read,
  };
  let isOkay = true;
  Status.errorMessage.errors = [];

  Object.keys(data).forEach((key) => {
    if (['name', 'mail', 'message'].includes(key) && Validations.isEmpty((data[key]))) {
      Status.errorMessage.errors.push(`Le champs ${key} est vide ou inexistant`);
      isOkay = false;
    }
    if (!Validations.isValidEmail(data.mail)) {
      Status.errorMessage.errors.push('Le mail saisi a un format incorrect');
      isOkay = false;
    }
  });

  if (!isOkay) return response.status(Status.status.bad).send(Status.errorMessage);

  try {
    // eslint-disable-next-line no-unused-vars
    const message = await Message.create(data);
    return response.status(Status.status.created).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const get = async (request, response) => {
  try {
    const { id } = request.params;
    const message = await Message.findByPk(id);
    if (!message) {
      Status.errorMessage.error = 'Aucun message avec cet id';
      return response.status(Status.status.notfound).send(Status.errorMessage);
    }
    Status.successMessage.data = message.dataValues;
    return response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const getAll = async (request, response) => {
  try {
    const {
      offset, limit, order, query,
    } = request.body;
    if (query !== undefined) {
      Object.keys(query).forEach((key) => {
        if (typeof query[key] === 'string') query[key] = { [Op.like]: `%${query[key]}%` };
      });
    }
    const { count, rows } = await Message.findAndCountAll({
      where: query,
      order,
      offset,
      limit,
    });
    Status.successMessage.data = rows;
    Status.successMessage.count = count;
    return response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const remove = async (request, response) => {
  try {
    const { ids } = request.body;
    await Message.destroy({
      where: {
        id: ids,
      },
    });
    Status.successMessage.data = 'Message supprimé';
    return response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const update = async (request, response) => {
  const data = {
    id: request.body.id === undefined ? null : request.body.id,
    name: request.body.name === undefined ? '' : request.body.name,
    mail: request.body.mail === undefined ? '' : request.body.mail,
    message: request.body.message === undefined ? '' : request.body.message,
    read: request.body.read === undefined ? null : request.body.read,
  };

  let isOkay = true;
  Status.errorMessage.errors = [];
  
  Object.keys(data).forEach((key) => {
    if (['id', 'mail', 'name'].includes(key) && Validations.isEmpty(new String(data[key]))) {
      Status.errorMessage.errors.push(`Le champs ${key} est vide ou inexistant`);
      isOkay = false;
    }
  });

  if (!isOkay) return response.status(Status.status.bad).send(Status.errorMessage);

  try {
    const message = await Message.findByPk(data.id);
    if (!message) {
      Status.errorMessage.errors.push('Aucun message avec cet id') ;
      return response.status(Status.status.notfound).send(Status.errorMessage);
    }

    if (data.read && data.read !== message.read) message.read = true;

    await message.save();
    Status.successMessage.data = message.dataValues;
    return response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};


module.exports = {
  create,
  get,
  getAll,
  remove,
  update,
};
