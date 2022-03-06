const transporter = require("../mail");

class MailSender {
  constructor() {}

  /**
   * Método para enviar un texto plano de mail.
   * @param {string} to Destinatario o destinatarios (separados por coma) del correo electrónico a enviarse.
   * @param {string} subject Asunto del correo electrónico.
   * @param {string} text Contenido de texto que vendrá.
   * @returns Promise: Objeto de confirmación de envío.
   */
  enviarEmailTextoPlano = async (to, subject, text) => {
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      text,
    };
    const resultado = await transporter.sendMail(mailOptions);
    return resultado;
  };

  /**
   * Método para enviar un mail con diseño de un botón de redirección.
   * @param {string | array} to Destinatario o destinatarios (separados por coma) del correo electrónico a enviarse.
   * @param {string} redirect Dirección URL de redirección que redireccionará el botón.
   * @returns Promise: Una promesa del objeto de envió de mail.
   */
  enviarMailConBoton = async (to, redirect) => {
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject: "Confirmar dirección de correo electrónico",
      html: `
        <div style="display:flex;flex-direction:column">
          <h3 style="color:black">
            Confirmar dirección de correo electrónico
          </h3>
          <div class="button-container">
            <a href="${redirect}" target="_blank" style="padding:30px 50px;background-color:blue;border-radius:5px;text-decoration:none">
              <span style="color:white">
                Confirmar correo
              </span>
            </a>
          </div>
        </div>
      `,
    };
    const resultado = await transporter.sendMail(mailOptions);
    return resultado;
  };

  /**
   * Método para enviar un correo electrónico con un diseño HTML dentro del mismo.
   * @param {string} to Destinatario o destinatarios (separados por coma) del correo electrónico a enviarse.
   * @param {string} subject Asunto del correo electrónico.
   * Importante definir un asunto para que el lector del correo electrónico tenga comprensión de que trata el mismo.
   * @param {string} html Código HTML con estilos embedidos para estilizar el diseño del correo electrónico.
   * @returns Object
   */
  enviarMailConDiseñoHtml = async (to, subject, html) => {
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to,
      subject,
      html,
    };
    const resultado = await transporter.sendMail(mailOptions);
    return resultado;
  };
}

module.exports = MailSender;
