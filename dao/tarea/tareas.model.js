const ObjectId = require("mongodb").ObjectId;
const { differenceInSeconds, addDays } = require("date-fns");
const getDb = require("../mongodb");
let db = null;

class Tareas {
  collection = null;
  matriculaCollection = null;
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection("Clases");
        this.matriculaCollection = db.collection("Matriculas");
        if (process.env.MIGRATE === "true") {
          // AUN NO SE REQUIERE NADA.
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  /**
   * CREAR METODO PARA INSERTAR CLASES
   * @param {String} id Identificador de la clases
   * @param {String} fechaAsignada fecha en la que se asigna la tarea
   * @param {String} fechaEntrega fecha limite para la entrega de la tarea
   * @param {String} estado Evalua si la tarea se entrega a tiempo
   * @param {Object} info Informacion de la tarea
   * @returns {Object}
   */
  async newTarea(id, fechaAsignada, fechaEntrega, estado, info) {
    const filter = { _id: new ObjectId(id) };

    const tiempo = Date.now();
    const hoy = new Date(tiempo);

    const numeroTarea =
      "HW" +
      hoy.getDate() +
      "_" +
      (hoy.getMonth() + 1) +
      "_" +
      hoy.getMilliseconds();
    const tareaCmd = {
      $push: {
        tareaAsignada: {
          numeroTarea,
          fechaAsignada,
          fechaEntrega,
          estado,
          info,
        },
      },
    };
    const rslt = await this.collection.updateOne(filter, tareaCmd);
    return rslt;
  }

  /**
   * Método para ingresar una tarea.
   * @param {string} id ObjectId de la clase en donde se ingresará la tarea.
   * @param {string} fechaAsignada Fecha en que fue asignada la tarea: YYYY-MM-DD HH:MM:SS
   * @param {string} fechaEntrega Fecha en que se entragará la tarea: YYYY-MM-DD HH:MM:SS
   * @param {string} estado Estado en que se encuentra la tarea
   * @param {string} info Información de la tarea.
   * @param {string} numeroTarea Numero tarea.
   * @returns Object
   */
  async updateTareaAsig(
    id,
    fechaAsignada,
    fechaEntrega,
    estado,
    info,
    numeroTarea
  ) {
    const filter = {
      _id: new ObjectId(id),
      "tareaAsignada.numeroTarea": numeroTarea,
    };
    const updateCmd = {
      $set: {
        "tareaAsignada.$": {
          numeroTarea,
          fechaAsignada,
          fechaEntrega,
          estado,
          info,
        },
      },
    };
    const rslt = await this.collection.update(filter, updateCmd);
    return rslt;
  }

  /**
   * Método para obtener todas las tareas de una clase.
   * @param {string} id ObjectId de las tareas de una clase
   * @returns Array
   */
  async allTareasClase(id) {
    const filter = { _id: new ObjectId(id) };
    const tareas = await this.collection.findOne(filter);
    return tareas.tareaAsignada;
  }

  // async updateEstadoTarea(id,numeroTarea,estado){

  // }

  // eliminar tarea
  async deleteTarea(id, numeroTarea) {
    const filter = { _id: new ObjectId(id) };
    const updateCmd = {
      $pull: { tareaAsignada: { numeroTarea: { $in: [numeroTarea] } } },
    };
    const rslt = await this.collection.updateOne(filter, updateCmd);
    return rslt;
  }
  getSecondsLeftHomework = async (tareas) => {
    console.log(tareas);
    const segundosFaltantes = tareas.map(async (tarea) => {
      return `Esta es la tarea => ${tarea?.numeroTarea}`;
    });
    return segundosFaltantes;
  };

  // Tratando de resolver problem asíncrono de obtener los segundo restantes de un tarea con una función map
  // https://javascript.plainenglish.io/using-asynchronous-operations-with-javascripts-array-map-method-1971e8093228
  obtenerTiempoFaltanteTareaTodasClases = async (idEstudiante) => {
    const pipeline = [
      {
        $match: {
          idEstudiante: new ObjectId(idEstudiante),
        },
      },
      {
        $lookup: {
          from: "Clases",
          localField: "idClase",
          foreignField: "_id",
          as: "clase",
        },
      },
      {
        $project: {
          clase: 1,
          infoEstudiante: 1,
        },
      },
      {
        $sort: {
          "clase.0.nombre": 1,
        },
      },
    ];
    const resultado = await this.matriculaCollection
      .aggregate(pipeline)
      .toArray();
    const tareas = resultado.map((infoClase, index, clases) => {
      const nombreClase = infoClase?.clase[0]?.nombre;
      const tareasAsignadas = infoClase?.clase[0]?.tareaAsignada;
      return { nombreClase, tareasAsignadas };
    });
    return { tareas };
  };
}

module.exports = Tareas;
