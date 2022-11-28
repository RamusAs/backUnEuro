const { server } = require('./config/serveur');
const ArticleService = require('./services/Articles');
const CategorieService = require('./services/Categories');
const MessageService = require('./services/Messages');
const BlogService = require('./services/Blog');
const CommentaireService = require('./services/Commentaire');
const NotificationService = require('./services/Notifications');

const UploadFile = require('./middleware/uploadFile');


const env = require('./env');


server.all('/article/create', ArticleService.create);
server.all('/article/update', ArticleService.update);
server.all('/article/delete', ArticleService.remove);
server.all('/article/:id', ArticleService.get);
server.all('/article', ArticleService.getAll);

server.all('/categorie/create', CategorieService.create);
server.all('/categorie/update', CategorieService.update);
server.all('/categorie/delete', CategorieService.remove);
server.all('/categorie/:id', CategorieService.get);
server.all('/categorie', CategorieService.getAll);

server.all('/message/create', MessageService.create);
server.all('/message/delete', MessageService.remove);
server.all('/message/update', MessageService.update);
server.all('/message/:id', MessageService.get);
server.all('/message', MessageService.getAll);

server.all('/blog/create', BlogService.create);
server.all('/blog/delete', BlogService.remove);
server.all('/blog/update', BlogService.update);
server.all('/blog/:id', BlogService.get);
server.all('/blog', BlogService.getAll);

server.all('/commentaire/create', CommentaireService.create);
server.all('/commentaire/:id', CommentaireService.get);
server.all('/commentaire', CommentaireService.getAll);
server.all('/commentaire/delete', CommentaireService.remove);

server.all('/notification/create', NotificationService.create);
server.all('/notification', NotificationService.getAll);
server.all('/notification/delete', NotificationService.remove);


server.all('/uploadFile', UploadFile);

const { port } = env;

// eslint-disable-next-line no-console
server.listen(port, () => console.log(`Server running on port ${port} 🔥`));
