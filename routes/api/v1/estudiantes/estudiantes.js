const express = require("express");
const router = express.Router();
const Estudiante = require("../../../../dao/estudiante/estudiantes.model");
const estudianteModel = new Estudiante();

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
      direccion
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
});
// post: /sigin

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
});
// post: /sigin

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
      direccion
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
    const {
      email,
      password,
      estado,
      tipo
    } = req.body;
    const { id } = req.params;

    const rslt = await estudianteModel.updateUserStudent(
      id,
      email,
      password,
      estado,
      tipo
      )
    res.status(200).json({ "status": "ok" })
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ "status": "failed" })
  }
}) // put: /updateUserStudent

//Ruta para actualizar la información del encargado
router.put("/updateStudentManager/:id", async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      telefono,
      email
    } = req.body;
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
}) // put: /updateStudentManager

/**
 * Ruta para cambiar el estado
 */

  router.put("/updatestatus/:id", async(req,res)=>{ 
    try{
      const {id} = req.params;
      const rslt = await estudianteModel.updateUserStatus(id);
      res.status(200).json({"status":"ok",rslt});
    }catch(ex){
      console.log(ex);
      res.status(500).json({"status":"failed"})
    }


  })

module.exports = router;