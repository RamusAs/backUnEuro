const { status } = require('../helpers/status');
const Validations = require('../helpers/validation');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const env = require('../env');

var transporter = nodemailer.createTransport(smtpTransport({
  host: env.hom,
  port: env.pom,
  auth: {
    user: env.usm,
    pass: env.pam
  },
  secure: true,
  tls: {
      rejectUnauthorized: false
  }
}));

const sendMail = async (request, response) => {
  try {
    /* if (request.method !== 'POST') {
      return response.status(status.allow).send({
        status: 'bad',
        message: 'Méthode Non Autorisée'
      });;
    } */
    const {to, subject, body, from} = request.body;

    let isOkay = true;
    const errors = [];
    
    if (!Validations.isValidEmail(from)) {
      errors.push('L\'email de l\'expéditeur n\'est pas valide');
      isOkay = false;
    }
    if (!Array.isArray(to)) {
      errors.push('Une liste de destinataire est obligatoire');
      isOkay = false;
    } else {
      to.forEach((email, i) => {
        if (!Validations.isValidEmail(email)) {
          errors.push(`L'email à l'index ${i} de la liste des destinataires n'est pas valide`);
          isOkay = false;
        }
      });
    }
    if (Validations.isEmpty(body)) {
      errors.push('Le message du mail est obligatoire');
      isOkay = false;
    }
    
    if (!isOkay) {
      return response.status(status.bad).send({
        status: 'bad',
        message: errors.join('\n')
      });
    }

    var mailOptions = {
      from,
      to,
      subject,
      html: body,
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        response.status(status.error).send({
          status: 'error',
          message: error.message,
          name: error.name
        });
      } else {
        response.status(status.created).json({
          status: 'created',
          message: 'Email sent: ' + info.response
        });
      }
    });
  } catch (error) {
    response.status(status.error).send({
      status: 'error',
      message: error.message,
      name: error.name
    });
  }
}

module.exports = sendMail;
