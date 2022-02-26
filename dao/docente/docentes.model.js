const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
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
}

module.exports = Docentes;
