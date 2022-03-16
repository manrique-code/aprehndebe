const express = require("express");
const router = express.Router();
const Estudiante = require("../../../../dao/estudiante/estudiantes.model");
const estudianteModel = new Estudiante();
const Matricula = require("../../../../dao/matricula/matriculas.model");
const matriculaModel = new Matricula();
const Tareas = require("../../../../dao/tarea/tareas.model");
const tareasModel = new Tareas();
const Usuario = require("../../../../dao/seguridad/usuarios.model");
const usuarioModel = new Usuario("Estudiantes");

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
      direccion,
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

/**
 * Ruta para que el estudiante inicie sesión con su usuario.
 */
router.post("/login", async (req, res) => {
  const { email, password, timestamp } = req.body;
  let usuario = null;
  let mail = null;
  try {
    usuario = await usuarioModel.obtenerUsuarioPorEmail(email);
    if (usuario) {
      const tareas = await tareasModel.obtenerTiempoFaltanteTareaTodasClases(
        usuario?._id
      );
      const segundos = await tareasModel.getSecondsLeftHomework(
        tareas?.tareasAsignadas
      );
      console.log(tareas);
      res.status(200).json({ status: "success" });
    }
    // 070: El usuario no existe en la base de datos.
    else
      res.status(400).json({
        status: "failed",
        msg: "Error al iniciar sesión. Por favor, intentalo más tarde.",
        error: 070,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

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

//ACTUALIZAR INFORMACIÓN DEL ESTUDIANTE
//Ruta para actualizar el estudiante
router.put("/updateStudent/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      genero,
      telefono,
      fotoPerfil,
      direccion,
    } = req.body;

    const result = await estudianteModel.updateStudent(
      id,
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      genero,
      telefono,
      fotoPerfil,
      direccion
    );
    res.status(200).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // put: /updateStudent

//Ruta para actualizar el usuario del estudiante
router.put("/updateUserStudent/:id", async (req, res) => {
  try {
    const { email, password, estado, tipo } = req.body;
    const { id } = req.params;

    const rslt = await estudianteModel.updateUserStudent(
      id,
      email,
      password,
      estado,
      tipo
    );
    res.status(200).json({ status: "ok" });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
}); // put: /updateUserStudent

//Ruta para actualizar la información del encargado
router.put("/updateStudentManager/:id", async (req, res) => {
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
}); // put: /updateStudentManager

/**
 * Ruta para cambiar el estado
 */
router.put("/updatestatus/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rslt = await estudianteModel.updateUserStatus(id);
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

/**
 * Ruta para obtener todas las notas de todas las clases a las cuales está matriculado un estudiante
 */
router.get("/notas/:idEstudiante", async (req, res) => {
  const { idEstudiante } = req.params;
  try {
    const payload = await matriculaModel.verTodasNotasEstudiante(idEstudiante);
    res.status(200).json({ status: "success", payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // get: /notas/:idestudiante

/**
 * Ruta para obtener la nota de una sola clase a la cual está matriculado el estudiante
 */
router.get("/nota-by-clase/:idEstudiante/:idClase", async (req, res) => {
  const { idEstudiante, idClase } = req.params;
  try {
    const payload = await matriculaModel.verNotaClaseEstudiante(
      idEstudiante,
      idClase
    );
    res.status(200).json({ status: "success", payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // get: /nota-by-clase/:idEstudiante/:idClase

module.exports = router;
