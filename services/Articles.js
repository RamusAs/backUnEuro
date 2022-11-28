const { Op } = require("sequelize")
const { Article, Categorie } = require("../models")
const Validations = require("../helpers/validation")
const Status = require("../helpers/status")

const create = async (request, response) => {
  const data = {
    idCat: request.body.idCat,
    img: request.body.img,
    title: request.body.title,
    etat: request.body.etat,
    desc: request.body.desc,
    price: request.body.price,
    authorContact: request.body.authorContact,
    authorName: request.body.authorName,
  }

  let isOkay = true
  Status.errorMessage.errors = []

  Object.keys(data).forEach((key) => {
    if (
      ["idCat", "title"].includes(key) &&
      Validations.isEmpty(new String(data[key]))
    ) {
      Status.errorMessage.errors.push(`Le champ ${key} est vide ou inexistant`)
      isOkay = false
    }
  })

  if (!Validations.isValidContact(data.authorContact)) {
    Status.errorMessage.errors.push(`Le champ Contact est erroné`)
    isOkay = false
  }

  if (!isOkay)
    return response.status(Status.status.bad).send(Status.errorMessage)

  try {
    const article = await Article.create(data)
    const categorie = await Categorie.findByPk(article.idCat)
    Status.successMessage.data = {
      ...article.dataValues,
      cat: categorie ? categorie.name : "",
    }
    return response.status(Status.status.created).json(Status.successMessage)
  } catch (error) {
    Status.errorMessage.error = error.message
    return response.status(Status.status.error).send(Status.errorMessage)
  }
}

const update = async (request, response) => {
  const data = {
    id: request.body.id === undefined ? null : request.body.id,
    idCat: request.body.idCat === undefined ? null : request.body.idCat,
    img: request.body.img === undefined ? "" : request.body.img,
    title: request.body.title === undefined ? null : request.body.title,
    etat: request.body.etat === undefined ? null : request.body.etat,
    desc: request.body.desc === undefined ? null : request.body.desc,
    price: request.body.price === undefined ? null : request.body.price,
  }
  let isOkay = true
  Status.errorMessage.errors = []

  Object.keys(data).forEach((key) => {
    if (data[key] === null) delete data[key]
    if (
      ["idCat", "title"].includes(key) &&
      Validations.isEmpty(
        data[key] === undefined ? undefined : new String(data[key])
      )
    ) {
      Status.errorMessage.errors.push(`Le champ ${key} est vide ou inexistant`)
      isOkay = false
    }
  })
  if (!isOkay)
    return response.status(Status.status.bad).send(Status.errorMessage)

  try {
    const article = await Article.findByPk(data.id)
    if (!article) {
      Status.errorMessage.error = "Aucun article avec cet id"
      return response.status(Status.status.notfound).send(Status.errorMessage)
    }
    Object.keys(data).forEach((key) => {
      if (data[key] !== article[key]) article[key] = data[key]
    })
    await article.save()
    const categorie = await Categorie.findByPk(article.idCat)
    Status.successMessage.data = {
      ...article.dataValues,
      cat: categorie ? categorie.name : "",
    }
    return response.status(Status.status.success).json(Status.successMessage)
  } catch (error) {
    Status.errorMessage.error = error.message
    return response.status(Status.status.error).send(Status.errorMessage)
  }
}

const get = async (request, response) => {
  try {
    const { id } = request.params
    const article = await Article.findByPk(id)
    if (!article) {
      Status.errorMessage.error = "Aucun article avec cet id"
      return response.status(Status.status.notfound).send(Status.errorMessage)
    }
    const categorie = await Categorie.findByPk(article.idCat)
    Status.successMessage.data = {
      ...article.dataValues,
      cat: categorie ? categorie.name : "",
    }
    return response.status(Status.status.success).json(Status.successMessage)
  } catch (error) {
    Status.errorMessage.error = error.message
    return response.status(Status.status.error).send(Status.errorMessage)
  }
}

const getAll = async (request, response) => {
  try {
    const { offset, limit, order, query } = request.body
    if (query !== undefined) {
      Object.keys(query).forEach((key) => {
        if (typeof query[key] === "string")
          query[key] = { [Op.like]: `%${query[key]}%` }
      })
    }
    const { count, rows } = await Article.findAndCountAll({
      where: query,
      order,
      offset,
      limit,
    })
    const articles = rows
    const req = []
    articles.forEach((art) => {
      req.push(Categorie.findByPk(art.idCat))
    })
    const res = await Promise.all(req)
    const data = articles.map((art, i) => ({
      ...art.dataValues,
      cat: res[i] ? res[i].name : "",
    }))
    Status.successMessage.data = data
    Status.successMessage.count = count
    return response.status(Status.status.success).json(Status.successMessage)
  } catch (error) {
    Status.errorMessage.error = error.message
    return response.status(Status.status.error).send(Status.errorMessage)
  }
}

const remove = async (request, response) => {
  try {
    const { ids } = request.body
    await Article.destroy({
      where: {
        id: ids,
      },
    })
    Status.successMessage.data = "Article(s) supprimé(s)"
    response.status(Status.status.success).json(Status.successMessage)
  } catch (error) {
    Status.errorMessage.error = error.message
    response.status(Status.status.error).send(Status.errorMessage)
  }
}

module.exports = {
  create,
  update,
  remove,
  get,
  getAll,
}
