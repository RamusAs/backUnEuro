const { Op } = require('sequelize');
const { Notification } = require('../models');
const Validations = require('../helpers/validation');
const Status = require('../helpers/status');

const create = async (request, response) => {
    const data = request.body;

    if (Validations.isEmpty(data.notification)) {
        Status.errorMessage.error = 'La notification est vide ou inexistant';
        return response.status(Status.status.bad).send(Status.errorMessage);
    }

    try {
        const notif = await Notification.create({
            notification: data.notification
        });
        Status.successMessage.data = notif.dataValues;
        return response.status(Status.status.created).json(Status.successMessage);
    } catch (error) {
        Status.errorMessage.error = error.message;
        return response.status(Status.status.error).send(Status.errorMessage);
    }
} 

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
        const { count, rows } = await Notification.findAndCountAll({
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
}

const remove = async(request, response) => {
    try {
        const { ids } = request.body;

        await Notification.destroy({
            where: {
                id: ids,
            },
        });
        Status.successMessage.data = 'Notification supprimé';
        return response.status(Status.status.success).json(Status.successMessage);
    } catch (error) {
        Status.errorMessage.error = error.message;
        return response.status(Status.status.error).send(Status.errorMessage);
    }
}


module.exports = {
    create,
    remove,
    getAll
}