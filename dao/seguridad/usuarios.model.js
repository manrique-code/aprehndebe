const bcrypt = require("bcryptjs");
class Usuarios {
  constructor() {}
  /**
   * Método para encriptar la contraseña del usuario.
   * @param {string} rawPassword Contraseña sin encriptar.
   * @returns string: Contraseña encriptada.
   */
  async hashPassword(rawPassword) {
    return await bcrypt.hash(rawPassword, 10);
  }

  /**
   * Método para comparar si las contraseña introducida por el usuario
   * coinicide con la contraseña encriptada de la base de datos.
   * @param {string} rawPassword Contraseña sin encriptar
   * @param {string} dbPassword Contraseña encriptada
   * @returns boolean
   */
  async comparePassword(rawPassword, dbPassword) {
    return await bcrypt.compare(rawPassword, dbPassword);
  }
}

module.exports = Usuarios;
