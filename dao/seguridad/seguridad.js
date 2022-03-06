const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
class Seguridad {
  NUMERO_VERIFICACION_POSIBLE = 999999;
  constructor() {}

  generarCodigoVerificacion = async () => {
    const codigoVerficacion = Math.floor(
      Math.random() * this.NUMERO_VERIFICACION_POSIBLE
    );
    return codigoVerficacion;
  };

  /**
   * Método para genera un token por un tiempo dado.
   * @param {Object} payload Contenido a ser cifrado
   * @param {string | number} time Tiempo de expiración del token. El token dura 15 minutos por default.
   * @returns Object: Cifrado del objeto
   */
  generarJwtTemporizado = async (payload, time = "15m") => {
    const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
      expiresIn: time,
    });

    return token;
  };

  /**
   * Método para desencriptar un token y obtener la información del payload.
   * @param {string} token Hashed token con la información a desencriptar.
   * @returns Object
   */
  decrypToken = async (token) => {
    const decryptedToken = await jsonwebtoken.decode(token, { complete: true });
    return decryptedToken;
  };
}

module.exports = Seguridad;
