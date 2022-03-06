const express = require("express");
const router = express.Router();

// Middlewares
const {
  verificarApiTokenHeader,
} = require("../../middlewares/apitokenVerifier");
const { passport, jwtMiddleWare } = require("../../middlewares/jwtHelper");

// Rutas de los controladores de cada clase necesitados por el API.
// Enrutador de Docentes.
const docentesRoutes = require("./docentes/docentes");
const estudiantesRoutes = require("./estudiantes/estudiantes");
const clasesRoutes = require("./clases/clases");
const tareasRoutes = require("./tareas/tareas");

router.use("/docentes", verificarApiTokenHeader, docentesRoutes);
router.use("/estudiantes", verificarApiTokenHeader, estudiantesRoutes);
router.use("/clases", verificarApiTokenHeader, clasesRoutes);
router.use("/tareas", verificarApiTokenHeader, tareasRoutes);

module.exports = router;
