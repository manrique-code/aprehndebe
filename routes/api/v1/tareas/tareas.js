const express = require("express");
const router = express.Router();
const Tareas = require("../../../../dao/tarea/tareas.model");
const Entregables = require("../../../../dao/tarea/tareasEntreg.model");
const tareasModel = new Tareas();
const entregablesModel = new Entregables();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ endpoint: "Tareas", update: new Date() });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
});

router.get("/alltareas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const rslt = await tareasModel.allTareasClase(id);
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/newtarea/:id", async (req, res) => {
  try {
    const { fechaAsignada, fechaEntrega, estado, info } = req.body;
    const { id } = req.params;
    const rslt = await tareasModel.newTarea(
      id,
      fechaAsignada,
      fechaEntrega,
      estado,
      info
    );
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/updateTarea/:id", async (req, res) => {
  try {
    const { fechaAsignada, fechaEntrega, estado, info, numeroTarea } = req.body;
    const { id } = req.params;
    const rslt = await tareasModel.updateTareaAsig(
      id,
      fechaAsignada,
      fechaEntrega,
      estado,
      info,
      numeroTarea
    );
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

module.exports = router;
