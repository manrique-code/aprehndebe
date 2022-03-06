const express = require("express");
const router = express.Router();
const Estudiante = require("../../../../dao/estudiante/estudiantes.model");
const estudianteModel = new Estudiante();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ endpoint: "Estudiantes", update: new Date() });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
}); // get: /

// Ruta para crear un estudiante: post /new
router.post("/new", async (req, res) => {
  try {
    console.log(req.body);
    const {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      genero,
      telefono,
      fotoPerfil,
      direccion
    } = req.body;
    const result = await estudianteModel.newEstudiante(
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      genero,
      telefono,
      fotoPerfil,
      direccion
    );
    // Status Code 201: código utilizado al momento de crear un recurso nuevo.
    res.status(201).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // post: /

// Ruta para crear el usuario de un estudiante /signin
router.put("/signin/:id", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { id } = req.params;
    const result = await estudianteModel.newUsuarioEstudiante(
      id,
      email,
      password
    );
    res.status(200).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // put: /sigin

// Ruta para crear el encargado de un estudiante /signin
router.put("/newencargado/:id", async (req, res) => {
  try {
    const { nombre, apellido, telefono, email } = req.body;
    const { id } = req.params;
    const result = await estudianteModel.newEncargadoEstudiante(
      id,
      nombre,
      apellido,
      telefono,
      email
    );
    res.status(200).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // put: /newencargado

module.exports = router;