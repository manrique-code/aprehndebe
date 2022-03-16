const express = require("express");
const router = express.Router();
const Clases = require("../../../../dao/clase/clases.model");
const claseModel = new Clases();
const Estudiante = require("../../../../dao/estudiante/estudiantes.model");
const estudianteModel = new Estudiante();
const Mail = require("../../../../dao/mail/mailSender");
const mailSender = new Mail();
const Usuario = require("../../../../dao/seguridad/usuarios.model");
const usuarioEstudiante = new Usuario("Estudiantes");
const usuarioDocente = new Usuario("Docentes");
const Matricula = require("../../../../dao/matricula/matriculas.model");
const matriculaModel = new Matricula();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ endpoint: "Clases", update: new Date() });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
});

/**
 * Enrutador para crear una nueva clase.
 */
router.post("/new/:idDocente", async (req, res) => {
  let mailDocente = null;
  let mail = null;
  const { nombre, horario, timestamp } = req.body;
  const { idDocente } = req.params;
  try {
    const existeClase = await claseModel.verificarClaseDocente(
      idDocente,
      nombre
    );
    if (!existeClase) {
      const clase = await claseModel.aperturarClase(
        idDocente,
        nombre,
        horario,
        timestamp
      );
      mailDocente = await usuarioDocente.obtenerUsuarioEmail(idDocente);
      if (clase) {
        mail = await mailSender.enviarEmailTextoPlano(
          mailDocente,
          "¡Clase creada correctamente!",
          `Acabás de crear la clase ${clase?.claseNombre}\nAprehnde. ¡Nunca parés de educar el futuro de nuestro país!`
        );
        res.status(201).json({ status: "success", clase, mail });
      }
    }
    // Ya existe una clase con ese nombre.
    else
      res.status(400).json({
        status: "failed",
        msg: "Ya tenés registrada una clase con ese nombre.",
        error: 101,
      });
  } catch (error) {}
}); // post: /new/:idDocente

/**
 * Enrutador para matricular un estudiante en una clase.
 */
router.post("/matricula/:idEstudiante", async (req, res) => {
  let mailEstudiante = null;
  let mailEncargado = null;
  const { codigoClase, timestamp } = req.body;
  const { idEstudiante } = req.params;
  try {
    const clase = await claseModel.obtenerClasePorCodigo(codigoClase);
    if (clase) {
      const emailEstudiante = await usuarioEstudiante.obtenerUsuarioEmail(
        idEstudiante
      );
      const emailEncargado = await estudianteModel.obtenerMailEncargado(
        idEstudiante
      );
      const { _id, nombre, estado, horario } = clase;
      if (estado === "MATRICULA") {
        const matricula = await matriculaModel.matricularClase(
          _id,
          idEstudiante,
          timestamp
        );
        if (matricula) {
          mailEstudiante = await mailSender.enviarEmailTextoPlano(
            `${emailEstudiante},${emailEncargado}`,
            "¡Matriculaste una clase!",
            `Felicidades, acabás de matricular ${nombre}.\n¡Nunca parés de aprender en Aprehnde!`
          );
          res.status(201).json({
            status: "success",
            matricula,
            mailEstudiante,
            mailEncargado,
          });
        } else {
          // 110: La matricula no pudo ser posible.
          res.status(400).json({
            status: "failed",
            error: 110,
            msg: "¡Va! No te pudimos matricular. Por favor, intentalo más tarde.",
          });
        }
      } else {
        // 107: La clase no está en estado de matrícula.
        res.status(400).json({
          status: "failed",
          error: 107,
          msg: "Clase no disponible para matricula. Contáctate con el docente de la clase para más información.",
        });
      }
    }
    //105: La clase no existe.
    else
      res.status(404).json({
        status: "failed",
        error: 105,
        msg: "¡Vaya!, la clase que querés matricular no existe. Por favor, revisá tu código ingresado.",
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // post: /matricula/:idEstudiante

module.exports = router;
