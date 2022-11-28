const { sequelize } = require('../config/db');
const Articles = require('./Articles');
const Categories = require('./Categories');
const Messages = require('./Messages');
const Blog = require('./Blog');
const Commentaire = require('./Commentaire');
const Notification = require('./Notification');

const ArticleModel = sequelize.define(
  'articles', Articles, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
  },
);

const CategorieModel = sequelize.define(
  'categories', Categories, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
  },
);

const MessageModel = sequelize.define(
  'messages', Messages, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
  },
);

const BlogModel = sequelize.define(
  'blog', Blog, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
  },
);

const CommentaireModel = sequelize.define(
  'commentaire', Commentaire, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
  }
)

const NotificationModel = sequelize.define(
  'notification', Notification, {
    freezeTableName: true,
    timestamps: true,
    createdAt: true,
    updatedAt: 'updateTimestamp',
  }
)

const SequelizeSy = async () => {
  try {
    await sequelize.authenticate();
    // eslint-disable-next-line no-console
    console.log('Connection has been established successfully.');
    await sequelize.sync({ alter: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  Article: ArticleModel,
  Categorie: CategorieModel,
  Message: MessageModel,
  Blog: BlogModel,
  Commentaire: CommentaireModel,
  Notification: NotificationModel,
  SequelizeSy,
};
