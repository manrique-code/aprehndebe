const { ObjectId } = require("mongodb");
const getDb = require("../mongodb");
let db = null;
class Matricula {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        db = database;
        this.collection = db.collection("Matriculas");
      })
      .catch((err) => {
        console.error(err);
      });
  }
  /**
   * Método para matricular un estudiante en una clase.
   * @param {string} idClase ObjectId de la clase a ser matriculada.
   * @param {string} idEstudiante ObjectId del estudiante a ser matriculado.
   * @returns Object
   */
  matricularClase = async (claseId, estudianteId, timestampMatricula) => {
    const payload = {
      idClase: new ObjectId(claseId),
      idEstudiante: new ObjectId(estudianteId),
      timestampMatricula: new Date(timestampMatricula),
      infoEstudiante: {
        notas: [],
        estado: null,
      },
      tareaEntregable: [],
    };
    const matricula = await this.collection.insertOne(payload);
    return matricula;
  };

  /**
   * Método para obtener todas de todas las clases a las cuales está matriculado un estudiante.
   * @param {string} idEstudiante ObjectId del estudiante del cual se quieren saber las notas.
   * @returns Promise
   */
  verTodasNotasEstudiante = async (idEstudiante) => {
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
    const notasCursor = await this.collection.aggregate(pipeline).toArray();
    const infoEstudiante = notasCursor.map((clase, i, clases) => {
      const idClase = clase?.clase[0]?._id;
      const claseNombre = clase?.clase[0]?.nombre;
      const notas = clase?.infoEstudiante?.notas.map((nota, index) => ({
        parcial: index !== 3 ? `${index + 1} Parcial` : "Recuperación",
        valor: parseInt(nota),
      }));
      let total = parseInt(
        clase?.infoEstudiante?.notas.reduce(
          (i, s) => parseInt(i) + parseInt(s),
          0
        )
      );
      return {
        idClase,
        claseNombre,
        notas,
        promedio: Math.round(total / notas.length),
      };
    });
    return {
      cantidadClases: notasCursor.length,
      infoEstudiante,
    };
  };

  /**
   * Método para obtener las notas de una sola clase.
   * @param {string} idEstudiante ObjectId del estudiante del cual se quiere saber su nota.
   * @param {string} idClase ObjectId de la clase de la cual se quiere saber su nota.
   * @returns Promise: Object
   */
  verNotaClaseEstudiante = async (idEstudiante, idClase) => {
    const pipeline = [
      {
        $match: {
          idEstudiante: new ObjectId(idEstudiante),
          idClase: new ObjectId(idClase),
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
    ];
    const clase = await this.collection.aggregate(pipeline).toArray();
    const infoEstudiante = clase.map((nota) => {
      const claseNombre = nota?.clase[0]?.nombre;
      const claseSeccion = nota?.clase[0]?.seccion;
      const claseHorario = nota?.clase[0].horario?.hora[0];
      const notas = nota?.infoEstudiante?.notas.map((nota, index) => ({
        parcial: index !== 3 ? `${index + 1} Parcial` : "Recuperación",
        valor: parseInt(nota),
      }));
      let totalNotas = parseInt(
        nota?.infoEstudiante?.notas.reduce(
          (i, s) => parseInt(i) + parseInt(s),
          0
        )
      );
      return {
        claseNombre,
        claseSeccion,
        claseHorario,
        notas,
        promedio: Math.round(totalNotas / notas.length),
      };
    });
    return infoEstudiante;
  };
}
module.exports = Matricula;
