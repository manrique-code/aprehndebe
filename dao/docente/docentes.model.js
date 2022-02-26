const { ObjectId } = require("mongodb");
const getDb = require("../mongodb");
let db = null;

class Docentes {
  collection = null;
  constructor() {
    getDb()
      .then((database) => {
        // Si la conexión a la base de datos se hace de manera correcta.
        db = database;
        this.collection = db.collection("Docentes");
      })
      .catch((err) => {
        console.error(err);
      });
  }

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
