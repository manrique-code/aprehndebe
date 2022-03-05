const express = require("express");
const router = express.Router();

// Rutas de los controladores de cada clase necesitados por el API.
// Enrutador de Docentes.
const docentesRoutes = require("./docentes/docentes");
const estudiantesRoutes = require("./estudiantes/estudiantes");
const clasesRoutes =  require("./clases/clases");
const tareasRoutes = require("./tareas/tareas");

router.use("/docentes", docentesRoutes);
router.use("/estudiantes", estudiantesRoutes);
router.use("/clases",clasesRoutes);
router.use("/tareas",tareasRoutes);

module.exports = router;
