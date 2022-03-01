const express = require("express");
const router = express.Router();
const Docente = require("../../../../dao/docente/docentes.model");
const docenteModel = new Docente();

router.get("/", (req, res) => {
  try {
    res.status(200).json({ endpoint: "Docentes", update: new Date() });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
}); // get: /

// Ruta para crear un docente: post /new
router.post("/new", async (req, res) => {
  try {
    const {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      titulosAcademicos,
      genero,
      telefono,
      direccion,
    } = req.body;
    const result = await docenteModel.newDocente(
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      titulosAcademicos,
      genero,
      telefono,
      direccion
    );
    // Status Code 201: código utilizado al momento de crear un recurso nuevo.
    res.status(201).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // post: /new

// Ruta para modificar la informacion de un docente update/
router.put("/update/:id", async(req, res) =>{
  try{
    const {id} = req.params
    const {
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      titulosAcademicos,
      genero,
      telefono,
      direccion,} =  req.body;
    const rslt = await docenteModel.updateDocente(
      id,
      identidad,
      nombres,
      apellidos,
      fechaNacimiento,
      titulosAcademicos,
      genero,
      telefono,
      direccion
    )
    res.status(200).json({"status":"ok",rslt})
  }catch(ex){
    console.log(ex);
    res.status(500).json({"status":"failed"})
  }
}); //put /docentes/update/:id

// Ruta para crear el usuario de un docente /signin
router.put("/signin/:identidad", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { identidad } = req.params;
    const result = await docenteModel.newUsuarioDocente(
      identidad,
      email,
      password
    );
    res.status(200).json({ status: "success", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

//Ruta para actualizar los usuarios de docentes, 
router.put("/updateuser/:identidad",async(req,res)=>{
  try{
    const {estado,email,tipo,password} = req.body;
    const {identidad} = req.params;
    
   
    const rslt =  await docenteModel.updateUser(identidad,email,password,estado,tipo)
    res.status(200).json({"status":"ok"})
  }catch(ex){
    console.log(ex);
    res.status(500).json({"status":"failed"})
  }
})
// post: /sigin

module.exports = router;
