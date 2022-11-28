const { Op } = require('sequelize');
const { Blog } = require('../models');
const Validations = require('../helpers/validation');
const Status = require('../helpers/status');

const create = async (request, response) => {
  const data = {
    auteur: request.body.auteur,
    img: request.body.img,
    title: request.body.title,
    subtitle: request.body.subtitle,
    texte: request.body.texte,
  };

  let isOkay = true;
  Status.errorMessage.errors = [];

  Object.keys(data).forEach((key) => {
    if (['title', 'subtitle', 'texte'].includes(key) && Validations.isEmpty(new String(data[key]))) {
      Status.errorMessage.errors.push(`Le champs ${key} est vide ou inexistant`);
      isOkay = false;
    }
  });

  if (!isOkay) return response.status(Status.status.bad).send(Status.errorMessage);

  try {
    const article = await Blog.create(data);
    Status.successMessage.data = {
      ...article.dataValues
    };
    return response.status(Status.status.created).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const update = async (request, response) => {
    const data = {
    auteur: request.body.auteur === undefined ? '' : request.body.auteur,
    id: request.body.id === undefined ? null : request.body.id,
    img: request.body.img === undefined ? '' : request.body.img,
    title: request.body.title === undefined ? null : request.body.title,
    subtitle: request.body.subtitle === undefined ? '' : request.body.subtitle,
    texte: request.body.texte === undefined ? null : request.body.texte,
  };
    
  let isOkay = true;
  Status.errorMessage.errors = [];

  Object.keys(data).forEach((key) => {
    if (data[key] === null) delete data[key];
    if (['title', 'subtitle', 'texte'].includes(key) && Validations.isEmpty(data[key] === undefined ? undefined : new String(data[key]))) {
      Status.errorMessage.errors.push(`Le champs ${key} est vide ou inexistant`);
      isOkay = false;
    }
  });
  if (!isOkay) return response.status(Status.status.bad).send(Status.errorMessage);

  try {
    const article = await Blog.findByPk(data.id);
    if (!article) {
      Status.errorMessage.error = 'Aucun article avec cette id';
      return response.status(Status.status.notfound).send(Status.errorMessage);
    }
    Object.keys(data).forEach((key) => {
      if (data[key] !== article[key]) article[key] = data[key];
    });
    await article.save();
      
    return response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    return response.status(Status.status.error).send(Status.errorMessage);
  }
};

const get = async (request, response) => {
  try {
    const { id } = request.params;
    const article = await Blog.findByPk(id);
    if (!article) {
      Status.errorMessage.error = 'Aucun article avec cette id';
      return response.status(Status.status.notfound).send(Status.errorMessage);
    }
    Status.successMessage.data = {
      ...article.dataValues,
    };
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
    const { count, rows } = await Blog.findAndCountAll({
      where: query,
      order: order,
      offset: offset,
      limit: limit,
    });
    console.log(rows);
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
    await Blog.destroy({
      where: {
        id: ids,
      },
    });
    Status.successMessage.data = 'Blog(s) supprimé(s)';
    response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    response.status(Status.status.error).send(Status.errorMessage);
  }
};

module.exports = {
  create,
  update,
  remove,
  get,
  getAll,
};
