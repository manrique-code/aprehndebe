const express = require("express");
const router = express.Router();
const Docente = require("../../../../dao/docente/docentes.model");
const docenteModel = new Docente();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ endpoint: "Docentes", update: new Date() });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
}); // get: /

// Ruta para crear un docente: post /new
router.post("/new", async (req, res) => {
  try {
    console.log(req.body);
    const {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      titulosAcademicos,
      genero,
      telefono,
      direccion,
    } = req.body;
    const result = await docenteModel.newDocente(
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      titulosAcademicos,
      genero,
      telefono,
      direccion
    );
    // Status Code 201: código utilizado al momento de crear un recurso nuevo.
    res.status(201).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // post: /new

// Ruta para crear el usuario de un docente /signin
router.put("/signin/:identidad", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { identidad } = req.params;
    const result = await docenteModel.newUsuarioDocente(
      identidad,
      email,
      password
    );
    res.status(200).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});
// post: /sigin

module.exports = router;
