const { Commentaire, Blog } = require('../models');
const Validations = require('../helpers/validation');
const Status = require('../helpers/status');
const { request, response } = require('express');

const create = async (request, response) => {
    const data = {
        idBlog: request.body.idBlog,
        name: request.body.name,
        mail: request.body.mail,
        message: request.body.message,
    };
    let isOkay = true;
    Status.errorMessage.errors = [];

    Object.keys(data).forEach((key) => {
        if (['idBlog', 'name'].includes(key) && Validations.isEmpty(new String(data[key]))) {
            Status.errorMessage.errors.push(`Le champs ${key} est vide ou inexistant`);
            isOkay = false;
        }
        if (data.mail) {
            if (!Validations.isValidEmail(data.mail)) {
                Status.errorMessage.errors.push('Le mail saisi a un format incorrect');
                isOkay = false;
            }
        }
    });

    if (!isOkay) return response.status(Status.status.bad).send(Status.errorMessage);

    try {
        const commentaire = await Commentaire.create(data);
        const blog = await Blog.findByPk(commentaire.idBlog);
        Status.successMessage.data = {
            ...commentaire.dataValues,
            commentaire: blog ? blog.title : '',
        };
        return response.status(Status.status.created).json(Status.successMessage);
    } catch (error) {
        Status.errorMessage.error = error.message;
        return response.status(Status.status.error).send(Status.errorMessage);
    }
};

const get = async (request, response) => {
  try {
    const { id } = request.params;
    const commentaire = await Commentaire.findByPk(id);
    if (!commentaire) {
      Status.errorMessage.error = 'Aucun commentaire avec cette id';
      return response.status(Status.status.notfound).send(Status.errorMessage);
    }
    const categorie = await Blog.findByPk(commentaire.idCat);
    Status.successMessage.data = {
      ...commentaire.dataValues,
      commentaire: blog ? blog.title : '',
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
      offset,
      limit,
      order,
      query,
    } = request.body;
    if (query !== undefined) {
      Object.keys(query).forEach((key) => {
        if (typeof query[key] === 'string') query[key] = { [Op.like]: `%${query[key]}%` };
      });
    }
    const { count, rows } = await Commentaire.findAndCountAll({
      where: query,
      order,
      offset,
      limit,
    });
    const commentaire = rows;
    const req = [];
    commentaire.forEach((art) => {
      req.push(Blog.findByPk(art.idCat));
    });
    const res = await Promise.all(req);
    const data = commentaire.map( art => ({
      ...art.dataValues
    }));
    Status.successMessage.data = data;
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
    await Commentaire.destroy({
      where: {
        id: ids,
      },
    });
    Status.successMessage.data = 'Commentaire(s) supprimé(s)';
    response.status(Status.status.success).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    response.status(Status.status.error).send(Status.errorMessage);
  }
};


module.exports = {
  create,
  get,
  getAll,
  remove,
};