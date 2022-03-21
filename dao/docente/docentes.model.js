const ObjectId = require("mongodb").ObjectId;
const getDb = require("../mongodb");
const Usuarios = require("../seguridad/usuarios.model");
const usuariosModel = new Usuarios();
const Seguridad = require("../seguridad/seguridad");
const seguridadModel = new Seguridad();
let db = null;

class Docentes {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        // Si la conexión a la base de datos se hace de manera correcta.
        db = database;
        this.collection = db.collection("Docentes");
        if (process.env.MIGRATE === "true") {
          this.collection.createIndex({ identidad: 1 }, { unique: true });
        }
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
   * @param {string} id Identificador de un usuario existente.
   * @param {string} email Email irrepetible.
   * @param {string} password Contraseña sin encriptar.
   * @returns Object
   */
  async newUsuarioDocente(id, email, password) {
    const filtro = { _id: ObjectId(id) };
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

    // if (process.env.MIGRATE === "true") {
    //   const index = this.collection.createIndex(
    //     { "usuario.email": 1 },
    //     { unique: true }
    //   );
    // }

    return seCreoUsuario;
  }

  /**
   * Esta funcion permite al docente editar parcialmente sus datos personales
   * no esta permitido que este cambie su identidad ya que son datos unicos requeridos
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
  ) {
    const filter = { _id: new ObjectId(id) };
    const updateCmd = {
      $set: {
        identidad,
        nombres,
        apellidos,
        fechaNacimiento,
        titulosAcademicos,
        genero,
        telefono,
        direccion,
      },
    };
    const rslt = await this.collection.updateOne(filter, updateCmd);
    return rslt;
  } /// update

  /**
   * Actualizacion de usuarios de docentes
   * @param {string} id Id de la coleccion de docente
   * @param {string} estado
   * @param {string} tipo
   * @param {string} email Email irrepetible.
   * @param {string} password Contraseña sin encriptar.
   * @returns Object
   */
  async updateUser(id, email, password, estado, tipo) {
    const filtro = { _id: new ObjectId(id) };
    const updateCmd = {
      $set: {
        usuario: {
          email,
          password: await usuariosModel.hashPassword(password),
          estado,
          tipo,
        },
      },
    };
    const rslt = await this.collection.updateOne(filtro, updateCmd);
    return rslt;
  }

  /**
   * Método para insertar el usuario en la base de datos.
   * @param {string} id ObjectId del usuario a verficar.
   * @returns Object
   */
  crearUsuarioDocenteVerificable = async (id, timestamp) => {
    const filtro = { _id: ObjectId(id) };
    const datosVerificacion = {
      $set: {
        verified: null,
        verifyInfo: {
          timestamp: new Date(timestamp),
          verifyCode: seguridadModel.generarCodigoVerificacion(),
        },
      },
    };
    const seInsertoVerificacion = await this.collection.updateOne(
      filtro,
      datosVerificacion
    );
    return seInsertoVerificacion;
  };

  // inactivar el usuario del docente
  async updateUserStatus(id, usuario) {
    const filtro = { _id: new ObjectId(id) };
    const userStatus = {
      $set: {
        "usuario.estado": "Inactivo",
      },
    };
    const rslt = await this.collection.updateOne(filtro, userStatus);
  }

  //activar el usuario del docente
  async updateUserStatusV(id, usuario) {
    const filtro = { _id: new ObjectId(id) };
    const userStatus = {
      $set: {
        "usuario.estado": "Activo",
      },
    };
    const rslt = await this.collection.updateOne(filtro, userStatus);
  }

    // Metodo para cambiar la contraseña del docente
  /**
   * 
   * @param {String} id usuario del docente 
   * @param {String} currentPassword contraseña actual 
   * @param {String} newPassword contraseña nueva
   * @returns Object
   */
   async updateUserPassword(id, currentPassword, newPassword) {
    const filtro = { _id: new ObjectId(id) };
    const passCmd = [
      {
        '$match': {
          '_id': new ObjectId(id)
        }
      }, {
        '$project': {
          'usuario.password': 1
        }
      }
    ]
    const dbPassword = await this.collection.aggregate(passCmd).toArray()
    const passDb = dbPassword[0].usuario.password

    const validate = await usuariosModel.comparePassword(currentPassword, passDb)

    if(validate) {
      const updateCmd = {
        $set: {
          "usuario.password": await usuariosModel.hashPassword(newPassword)
        },
      };
      const rslt = await this.collection.updateOne(filtro, updateCmd);
      return rslt;
    } else{
      return "Error"
    }
  }
}

module.exports = Docentes;
