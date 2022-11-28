const { Op } = require('sequelize');
const { Categorie, Article } = require('../models');
const Validations = require('../helpers/validation');
const Status = require('../helpers/status');

const create = async (request, response) => {
  const data = request.body;
  if (Validations.isEmpty(data.name)) {
    Status.errorMessage.error = 'Le champs nom de la catégorie est vide ou inexistant';
    return response.status(Status.status.bad).send(Status.errorMessage);
  }
  try {
    const categorie = await Categorie.create({
      name: data.name,
    });
    Status.successMessage.data = categorie.dataValues;
    return response.status(Status.status.created).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const update = async (request, response) => {
  const data = {
    id: request.body.id === undefined ? '' : request.body.id,
    name: request.body.name,
  };

  let isOkay = true;
  Status.errorMessage.errors = [];
  
  if (Validations.isEmpty(data.name)) {
    Status.errorMessage.errors.push(`Le champs ${key} de la catégorie est vide ou inexistant`);
    isOkay = false;
  }

  if (!isOkay) return response.status(Status.status.bad).send(Status.errorMessage);

  try {
    const categorie = await Categorie.findByPk(data.id);
    if (!categorie) {
      Status.errorMessage.error = 'Aucune catégorie avec cet id';
      return response.status(Status.status.notfound).send(Status.errorMessage);
    }
    Object.keys(data).forEach((key) => {
      if (data[key] && data[key] !== categorie[key]) categorie[key] = data[key];
    });
    await categorie.save();
    Status.successMessage.data = categorie.dataValues;
    return response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const get = async (request, response) => {
  try {
    const { id } = request.params;
    const categorie = await Categorie.findByPk(id);
    if (!categorie) {
      Status.errorMessage.error = 'Aucune catégorie avec cet id';
      return response.status(Status.status.notfound).send(Status.errorMessage);
    }
    Status.successMessage.data = categorie.dataValues;
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
    const { count, rows } = await Categorie.findAndCountAll({
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
    await Article.destroy({
      where: {
        idCat: ids,
      },
    });
    await Categorie.destroy({
      where: {
        id: ids,
      },
    });
    Status.successMessage.data = 'Categorie supprimé';
    return response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

module.exports = {
  create,
  update,
  remove,
  get,
  getAll,
};
