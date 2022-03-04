const nodemailer = require("nodemailer");

/**
 * Implementación de un transporter o medio por el cual se va a enviar nuestro correo electrónico.
 * En este caso estamos utilizando gmail. Para ver las credenciales que se están utilizando ver las variables de ambiente.
 */
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

module.exports = transporter;
