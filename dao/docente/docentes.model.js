const bcrypt = require("bcryptjs");
const ObjectId = require('mongodb').ObjectId;
const getDb = require("../mongodb");
const Usuarios = require("../seguridad/usuarios.model");
const usuariosModel = new Usuarios();
let db = null;

class Docentes {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        // Si la conexión a la base de datos se hace de manera correcta.
        db = database;
        this.collection = db.collection("Docentes");
        this.collection.createIndex(
          { identidad: 1, email: 1 },
          { unique: true }
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Método para ingresar los datos personales del docente a la base de datos.
   * @param {string} identidad Número de identindad único del docente
   * @param {string} nombres Nombre y segundo nombre del docente
   * @param {string} apellidos Primer y segudo apellidio
   * @param {string} fechaNacimiento YYYY-MM-DD
   * @param {Array} titulosAcademicos Arreglo de títulos académicos
   * @param {string} genero Genero
   * @param {Array} telefono Arreglo de número telefónicos
   * @param {Array} direccion Arreglo de direcciones
   * @returns Object
   */

  async newDocente(
    identidad,
    nombres,
    apellidos,
    fechaNacimiento,
    titulosAcademicos,
    genero,
    telefono,
    direccion
  ) {
    const docente = {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      titulosAcademicos,
      genero,
      telefono,
      direccion,
    };
    const resultado = await this.collection.insertOne(docente);
    return resultado;
  }

  /**
   * Método para crear el usuario a un docente.
   * @param {string} identidad Identidad de un usuario existente.
   * @param {string} email Email irrepetible.
   * @param {string} password Contraseña sin encriptar.
   * @returns Object
   */

  async newUsuarioDocente(identidad, email, password) {
    const filtro = { identidad };
    const usuarioDocente = {
      $set: {
        usuario: {
          email,
          password: await usuariosModel.hashPassword(password),
          estado: "Activo",
          tipo: "Docente",
        },
      },
    };
    const seCreoUsuario = await this.collection.updateOne(
      filtro,
      usuarioDocente
    );
    return seCreoUsuario;
  }
  
  // Esta funcion permite al docente editar parcialmente sus datos personales,
  // no esta permitido que este cambie su identidad ya que son datos unicos requeridos
   /**
   * @param {string} identidad Número de identindad único del docente
   * @param {string} nombres Nombre y segundo nombre del docente
   * @param {string} apellidos Primer y segudo apellidio
   * @param {string} fechaNacimiento YYYY-MM-DD
   * @param {Array} titulosAcademicos Arreglo de títulos académicos
   * @param {string} genero Genero
   * @param {Array} telefono Arreglo de número telefónicos
   * @param {Array} direccion Arreglo de direcciones
   * @returns Object
   */
  async updateDocente(
    id,
    identidad,
    nombres,
    apellidos,
    fechaNacimiento,
    titulosAcademicos,
    genero,
    telefono,
    direccion
  ){
    const filter ={_id:new ObjectId(id)};
    const updateCmd = {
      "$set":{
        identidad,
        nombres,
        apellidos,
        fechaNacimiento,
        titulosAcademicos,
        genero,
        telefono,
        direccion
      }
    };
    const rslt = await this.collection.updateOne(filter,updateCmd);
    return rslt;

  } /// update

  // Actualizacion de ususarios de docentes
  /**
   * 
   * @param {string} id Id de la coleccion de docente
   * @param {string} estado
   * @param {string} tipo
   * @param {string} email Email irrepetible.
   * @param {string} password Contraseña sin encriptar.
   * @returns Object
   */
  async updateUser(id, email, password,estado,tipo){
    const filtro = {"_id": new ObjectId(id)};
    const updateCmd = {
      "$set":{
          "usuario":{
            email,
            password:await usuariosModel.hashPassword(password),
            estado,
            tipo,
          }
      }
    }
    const rslt = await this.collection.updateOne(filtro,updateCmd);
    return rslt;
  }
  // inactivar el usuario del docente
  async updateUserStatus(id, usuario) {
    const filtro = { _id: new ObjectId(id)}
    const userStatus = {
      "$set": {
        "usuario.estado":"Inactivo"
      }
    };
    const rslt = await this.collection.updateOne(filtro, userStatus);
  }

  //activar el usuario del docente
  async updateUserStatusV(id, usuario) {
    const filtro = { _id: new ObjectId(id)}
    const userStatus = {
      "$set": {
        "usuario.estado":"Activo"
      }
    };
    const rslt = await this.collection.updateOne(filtro, userStatus);
  }

}

module.exports = Docentes;
