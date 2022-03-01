const express = require("express");
const router = express.Router();

// Rutas de los controladores de cada clase necesitados por el API.
// Enrutador de Docentes.
const docentesRoutes = require("./docentes/docentes");
const estudiantesRoutes = require("./estudiantes/estudiantes");

router.use("/docentes", docentesRoutes);
router.use("/estudiantes", estudiantesRoutes);

module.exports = router;
