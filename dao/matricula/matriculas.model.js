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
  matricularClase = async (claseId, estudianteId) => {
    const payload = {
      idClase: new ObjectId(claseId),
      idEstudiante: new ObjectId(estudianteId),
      timestampMatricula: new Date(),
      infoEstudiante: {
        notas: [],
        estado: null,
      },
      tareaEntregable: [],
    };
    const matricula = await this.collection.insertOne(payload);
    return matricula;
  };
}
module.exports = Matricula;
