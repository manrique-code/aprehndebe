const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const getDb = require("../mongodb");
const Usuarios = require("../seguridad/usuarios.model");
const usuariosModel = new Usuarios();
let db = null;

class Estudiantes {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        // Si la conexión a la base de datos se hace de manera correcta.
        db = database;
        this.collection = db.collection("Estudiantes");
        this.collection.createIndex(
          {identidad:1, email:1},
          {unique: true}
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Método para ingresar los datos personales del docente a la base de datos.
   * @param {string} identidad Número de identindad único del estudiante
   * @param {string} nombres Nombre y segundo nombre del estudiante
   * @param {string} apellidos Primer y segudo apellidio del estudiante
   * @param {string} fechaNacimiento YYYY-MM-DD
   * @param {string} genero Genero
   * @param {Array} telefono Arreglo de número telefónicos
   * @param {Array} direccion Arreglo de direcciones
   * @returns Object
   */

  async newEstudiante(
    identidad,
    nombres,
    apellidos,
    fechaNacimiento,
    genero,
    telefono,
    fotoPerfil,
    direccion
  ) {
    const estudiante = {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      genero,
      telefono,
      fotoPerfil,
      direccion,
    };
    const resultado = await this.collection.insertOne(estudiante);
    return resultado;
  }
  /**
   * Método para crear el usuario a un estudiante.
   * @param {string} identidad Identidad de un usuario existente.
   * @param {string} email Email irrepetible.
   * @param {string} password Contraseña sin encriptar.
   * @returns Object
   */
   async newUsuarioEstudiante(id, email, password) {
    const filtro = { "_id": new ObjectId(id) };
    const usuarioEstudiante = {
      $set: {
        usuario: {
          email,
          password: await usuariosModel.hashPassword(password),
          estado: "Activo",
          tipo: "Estudiante",
        },
      },
    };
    const seCreoUsuario = await this.collection.updateOne(
      filtro,
      usuarioEstudiante
    );
    return seCreoUsuario;
  }

  async newEncargadoEstudiante(id, nombre, apellido, telefono, email) {
    const filtro = { "_id": new ObjectId(id) };
    const usuarioEstudiante = {
      $set: {
        encargado:{
          nombre,
          apellido,
          telefono,
          email
        }
      },
    };
    const seCreoUsuario = await this.collection.updateOne(
      filtro,
      usuarioEstudiante
    );
    return seCreoUsuario;
  }

//ACTUALIZAR INFORMACIÓN DEL ESTUDIANTE
async updateStudent(id, identidad, nombres, apellidos, fechaNacimiento, genero, telefono, fotoPerfil, direccion) {
  const filter = { _id: new ObjectId(id) };
  const updateCmd = {
    "$set": {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      genero,
      telefono,
      fotoPerfil,
      direccion
    }
  };
  const rslt = await this.collection.updateOne(filter, updateCmd);
  return rslt;
}

async updateUserStudent(id, email, password, estado, tipo) {
  const filtro = { "_id": new ObjectId(id) };
  const updateCmd = {
    "$set": {
      "usuario": {
        email,
        password: await usuariosModel.hashPassword(password),
        estado,
        tipo,
      }
    }
  }
  const rslt = await this.collection.updateOne(filtro, updateCmd);
  return rslt;
}

async updateStudentManager(id, nombre, apellido, telefono, email){
  const filtro = { "_id": new ObjectId(id) };
  const updateCmd = {
    "$set": {
      "encargado": {
        nombre,
        apellido,
        telefono,
        email,
      }
    }
  }
  const rslt = await this.collection.updateOne(filtro, updateCmd);
  return rslt;
}

  /**
   * metodo que resume dos modulos en uno, cambiando el estado de un estudiante
   * en una sola accion para optimizacion del proceso(CONSIDERAR ESTE METODO PARA DOCENTE)
   * @param {String} id el unico parametro requerido es el objectID 
   */
  async updateUserStatus(id) {
    const filtro = { _id: new ObjectId(id) };
    const est = await this.collection.findOne(filtro);
    let sta = (est.usuario.estado ==="Activo")? "Inactivo":"Activo";
    const userStatus = {
      $set: {
        "usuario.estado": sta,
      },
    };
    const rslt = await this.collection.updateOne(filtro, userStatus);
  }

  //habilitar el usuario de estudiante
  // async updateUserActivate(id, usuario) {
  //   const filtro = { _id: new ObjectId(id) };
  //   const userStatus = {
  //     $set: {
  //       "usuario.estado": "Activo",
  //     },
  //   };
  //   const rslt = await this.collection.updateOne(filtro, userStatus);
  // }
}

module.exports = Estudiantes;
