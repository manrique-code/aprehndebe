const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const getDb = require("../mongodb");
let db = null;
class Usuarios {
  tipo = "";
  constructor(_collection) {
    getDb()
      .then((database) => {
        db = database;
        this.tipo = _collection;
      })
      .catch((err) => {
        console.error(err);
      });
  }
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

  /**
   * Método para verificar si una dirección de correo electrónico existe en la base de datos.
   * @param {string} email Dirección de correo electrónico del email a buscar
   * @returns string
   */
  encontrarPorEmail = async (email) => {
    const filtro = { "usuario.email": email };
    const busqueda = {
      projection: {
        _id: 1,
        usuario: 1,
      },
    };
    const existeEmail = await db
      .collection(this.tipo)
      .findOne(filtro, busqueda);
    return existeEmail;
  };

  /**
   * Método para saber sí un usuario está activo.
   * @param {string} email Dirección de correo electrónico del email a buscar
   * @returns string
   */
  verificarUsuarioActivo = async (email) => {
    const filtro = { "usuario.email": email };
    const busqueda = { projection: { _id: 0, "usuario.estado": true } };
    const estaActivo = await db.collection(this.tipo).findOne(filtro, busqueda);
    return estaActivo?.usuario?.estado;
  };

  /**
   * Método para obtener el correo electrónico de un usuario.
   * @param {string} idusuario ObjectId del usuario de quien queremos saber el email.
   * @returns string
   */
  obtenerUsuarioEmail = async (idusuario) => {
    const filtro = { _id: ObjectId(idusuario) };
    const busqueda = { projection: { _id: false, "usuario.email": true } };
    const email = await db.collection(this.tipo).findOne(filtro, busqueda);
    return email?.usuario?.email;
  };

  obtenerUsuarioPorId = async (id) => {
    const filtro = { _id: ObjectId(id) };
    const usuario = await db.collection(this.tipo).findOne(filtro);
    return usuario;
  };

  /**
   * Método para obtener la información del usuario a través de su email.
   * @param {string} email Dirección de correo electrónico del usuario.
   * @returns Object
   */
  obtenerUsuarioPorEmail = async (email) => {
    const filtro = { "usuario.email": email };
    const usuario = await db.collection(this.tipo).findOne(filtro);
    return usuario;
  };

  /**
   * Método para obtener información del usuario a través de su identidad.
   * @param {string} identidad Identidad del usuario.
   * @returns Object
   */
  obtenerUsuarioPorIdentidad = async (identidad) => {
    const filtro = { identidad };
    const usuario = await db.collection(this.tipo).findOne(filtro);
    return usuario;
  };
}

module.exports = Usuarios;
