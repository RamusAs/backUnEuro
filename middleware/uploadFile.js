const Status = require('../helpers/status');

const uploadFile = async (request, response) => {
  try {
    const { path } = request.query;
    
    if(!request.files) {
      Status.errorMessage.error = 'Aucun fichier';
      return response.status(Status.status.nocontent).send(Status.errorMessage);
    }

    let fiedFile = request.files.fiedFile;

    let moveTo = '';
    if (path) moveTo += path + '/';
    moveTo += fiedFile.name

    fiedFile.mv('./uploads/' + moveTo);
    
    Status.successMessage.data = {
      message: 'Fichier enregistré',
      url: request.protocol + '://' + request.get('host') + '/' + moveTo,
    }
    response.status(Status.status.created).json(Status.successMessage);
  } catch (error) {
    Status.errorMessage.error = error.message;
    response.status(Status.status.error).send(Status.errorMessage);
  }
}

module.exports = uploadFile;
