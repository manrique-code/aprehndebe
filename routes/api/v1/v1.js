const express = require("express");
const router = express.Router();

// Rutas de los controladores de cada clase necesitados por el API.
// Enrutador de Docentes.
const docentesRoutes = require("./docentes/docentes");

router.use("/docentes", docentesRoutes);

module.exports = router;
