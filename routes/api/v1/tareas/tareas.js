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

// RUTA PARA CREAR UN ENTREGABLE
router.put("/newentregable/:idclas/:idest", async (req, res) => {
  try {
    const { idclas, idest } = req.params;
    const { numeroTarea, documentoURL, estado,fechaEntrega } = req.body;

    const rslt = await entregablesModel.newEntrega(
      idclas,
      idest,
      numeroTarea,
      fechaEntrega,
      documentoURL,
    );
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/updateentregable/:idclas/:idest", async (req, res) => {
  try {
    const { idclas, idest } = req.params;
    const { numeroTarea, documentoURL, estado,fechaEntrega} = req.body;
    
    const rslt = await entregablesModel.updateEntrega(
      idclas,
      idest,
      numeroTarea,
      fechaEntrega,
      documentoURL,
      estado
    );
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

//router delete tarea()
router.delete("/deleteTarea/:id/:idtarea", async (req, res) => {
  try {
    const { id, idtarea } = req.params;
    const result = await tareasModel.deleteTarea(id, idtarea);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

//router para obtener las tareas pendientes por estudiante
router.get("/tareasest/:idclas/:idest", async(req,res)=>{
  try {
    const {idest,idclas} = req.params;
    const rslt = await tareasModel.verTareasClaseEstudiante(idclas,idest);
    res.status(200).json({status:"ok",rslt})
  } catch (error) {
    res.status(500).json({ status: "failed" });
    console.log(error);
  }
})

module.exports = router;
