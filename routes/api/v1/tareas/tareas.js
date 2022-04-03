const express = require("express");
const multer = require("multer");
const router = express.Router();
const Tareas = require("../../../../dao/tarea/tareas.model");
const TareasEntregable = require("../../../../dao/tarea/tareasEntreg.model");
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

router.get("/alltareas", async (req, res) => {
  try {
    const { idclas,idest } = req.query;
    const rslt = await tareasModel.allTareasClase(idclas,idest);
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

router.get("/allentregas", async(req,res)=>{
  try {
    const { idclas,idest } = req.query;
    const rslt = await entregablesModel.verTareasEntregadasEstudiante(idclas,idest);
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  } 
})

router.get("/tareabyid", async (req, res) => {
  try {
    const { idclas,num } = req.query;
    const rslt = await tareasModel.tareaById(idclas,num);
    console.log(rslt)
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

router.get("/entregada", async(req,res)=>{
  try{
    const {idclas,idest,num} = req.query;
    const rslt = await entregablesModel.entregada(idclas,idest,num)
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
})
// RUTA PARA CREAR UN ENTREGABLE
// FUNCION QUE GUARDA EL ARCHIVO
const storage = multer.diskStorage({
  destination:'uploads/',
  filename:(req,file,callback)=>{
    callback('',file.originalname)
    // callback('',file.name+"."+"pdf")
  }
})
const upload = multer({
    storage:storage
})

//RUTA QUE RECIVE EL ARCHIVO
router.post('/file',upload.single("file"),async(req,res)=>{
      res.status(200).json({ status: "ok" });
});

//RUTA PARA ALMACENAR LOS DATOS DE LA TAREA
router.put("/newentregable", async (req, res) => {
  try {
    const { idclas, idest } = req.body.params;
    console.log(req.body)
    const { numeroTarea, documentoURL,archivo,estado,fechaEntrega } = req.body.body;
    console.log(idclas);
    console.log(idest);
    console.log(numeroTarea);
    console.log(documentoURL);
    console.log(fechaEntrega);

    const rslt = await entregablesModel.newEntrega(
      idclas,
      idest,
      numeroTarea,
      fechaEntrega,
      documentoURL
    );
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

router.put("/updateentregable", async (req, res) => {
  try {
    const { idclas, idest } = req.body.params;
    const { numeroTarea, documentoURL, estado,fechaEntrega} = req.body.body;
    
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
router.delete("/deletetarea", async (req, res) => {
  try {
    const { id, idtarea } = req.body.params;
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

//router para eliminar una tarea que este entregada
router.delete("/deleteentregable", async (req, res) => {
  try {
    const { idclas,idest,numeroTarea} = req.query;
    const result = await entregablesModel.deleteEntregable(idclas,idest,numeroTarea)
    res.status(200).json({
      status: "ok",
      //result,
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

//router para obtener las tareas pendientes por estudiante  /:idclas/:idest
router.get("/tareasest", async(req,res)=>{
  try {
    const {idest,idclas} = req.query;
    console.log(req.query)
    const rslt = await tareasModel.verTareasClaseEstudiante(idclas,idest);
    res.status(200).json({status:"ok",rslt})
  } catch (error) {
    res.status(500).json({ status: "failed" });
    console.log(error);
  }
})

//router para insertar puntaje
router.put("/evaluartarea/:idclas/:idest", async(req,res)=>{
  try {
    const {idest,idclas} = req.params;
    const {numeroTarea,puntaje} = req.body;
    const rslt = await entregablesModel.newEvaluacion(idclas,idest,numeroTarea,puntaje);
    res.status(200).json({status:"ok",rslt})
  } catch (error) {
    res.status(500).json({ status: "failed" });
    console.log(error);
  }
})

module.exports = router;
