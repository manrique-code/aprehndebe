const { ObjectId } = require("mongodb");
const getDb = require("../mongodb");
let db = null;

class Clases {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection("Clases");
        if (process.env.MIGRATE === "true") {
          this.collection.createIndex({ codigo: 1 }, { unique: true });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * Método para generar un código único de inscripción de una clase.
   * @param {string} nombreClase Nombre de la clase a la cual se generará el código único de inscripción.
   * @param {Number} hora Hora en formato de 24hrs en que inicia la clase. Ejem: 0700, 1200, 1700.
   * @returns string
   */
  generarCodigoClase = (nombreClase, hora) => {
    const codigoClase = `${nombreClase
      .match(/([A-Z])/g)
      .join("")}${hora}#${Math.floor(Math.random() * 9999)}`;
    return codigoClase;
  };

  /**
   * Método para generar la sección de una clase.
   * @param {Number} horaInicio Hora en formato de 24hrs en que inicia la clase. Ejem: 0700, 1200, 1700.
   * @returns string
   */
  generarSeccionClase = (horaInicio) => {
    return `${horaInicio + 1}`;
  };

  /**
   * Método para aperturar (crear) una clase.
   * @param {string} idDocente ObjectId del docente que imparte la clase.
   * @param {*} nombre Nombre de la Clase.
   * @param {*} horario
   * @returns
   */
  aperturarClase = async (idDocente, nombre, horario, timestamp) => {
    const clase = {
      nombre,
      docente: ObjectId(idDocente),
      seccion: this.generarSeccionClase(horario.hora[0]),
      codigo: this.generarCodigoClase(nombre, horario.hora[0]),
      horario,
      estado: "MATRICULA",
      tareaAsignada: [],
      timestamp: new Date(timestamp),
    };
    const claseCreada = await this.collection.insertOne(clase);
    return { claseCreada, claseNombre: clase?.nombre, fecha: clase?.timestamp };
  };

  /**
   * Método para verificar sí una clase existe.
   * @param {string} codigoClase Código de la clase a verificar sí existe.
   * @returns Promise
   */
  verificarClaseDocente = async (idDocente, nombreClase) => {
    const pipeline = [
      {
        $match: {
          docente: new ObjectId(idDocente),
        },
      },
      {
        $match: { nombre: nombreClase },
      },
      {
        $project: { estado: 1 },
      },
    ];
    const existeClase = await this.collection.aggregate(pipeline).toArray();
    return existeClase.length;
  };

  /**
   * Método para obtener el ObjectId de una clase a través de su código único de identificación.
   * @param {string} codigoClase Código de la clase de la cual se quiere obtener el ObjectId
   * @returns Object
   */
  obtenerClasePorCodigo = async (codigoClase) => {
    const filtro = { codigo: codigoClase };
    const idClase = await this.collection.findOne(filtro);
    return idClase;
  };

  /**
   * Método para verificar sí una clase está en estado de matricula.
   * @param {string} idClase ObjectId de la clase.
   * @returns boolean
   */
  verificarClasePermiteMatricula = async (idClase) => {
    const filtro = { _id: new ObjectId(idClase) };
    const busqueda = { projection: { _id: false, estado: true } };
    const { estado } = await this.collection.findOne(filtro, busqueda);
    return estado === "MATRICULA";
  };

  /**
   * Método para obtener la hora con los dos puntos. Ejem: 1800 => "18:00"
   * @param {Number} horaEntrada Hora de entrada en formato de 24 horas. Ejem: 700,
   * @returns
   */
  generarHoraEntrada = (horaEntrada) => {
    let hora = "";
    const replacer = (match) => `${match}:`;
    switch (`${horaEntrada}`.length) {
      case 3:
        hora = horaEntrada.replace(/^\d{1}/g, replacer);
        break;
      case 4:
        hora = horaEntrada.replace(/^\d{2}/g, replacer);
      default:
        hora = false;
    }
    return hora;
  };

  // crear Anuncio
 async newAnuncio(id, fecha, descripcion) {
  const filtro = { _id: ObjectId(id) };
  const updateCmd = {
    $push: {
      anuncio: {
        fecha,
        descripcion
      },
    },
  };
  const rslt = await this.collection.updateOne(filtro,updateCmd);
    return rslt;
};

async obtenerAnunciosPorClase(id){
  const filtro = { _id: ObjectId(id) };
  const busqueda = {projection:{_id: 0, anuncio : 1}};

  const rslt = await this.collection.findOne(filtro,busqueda);
  return rslt;
}
}

module.exports = Clases;
