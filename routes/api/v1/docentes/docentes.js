const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Docente = require("../../../../dao/docente/docentes.model");
const docenteModel = new Docente();
const Mail = require("../../../../dao/mail/mailSender");
const mailSender = new Mail();
const Seguridad = require("../../../../dao/seguridad/seguridad");
const seguridadModel = new Seguridad();
const Usuarios = require("../../../../dao/seguridad/usuarios.model");
const usuarioModel = new Usuarios("Docentes");

router.get("/", (req, res) => {
  try {
    res.status(200).json({ endpoint: "Docentes", update: new Date() });
  } catch (error) {
    res.status(500).json({ status: "failed" });
  }
}); // get: /

router.get("/userbyid/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usuarioModel.obtenerUsuarioPorId(id);
    res.status(200).json({ status: "success", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

router.get("/userbyemail/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await usuarioModel.obtenerUsuarioPorEmail(email);
    res.status(200).json({ status: "success", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

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
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
    );
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
}); //put /docentes/update/:id

// Solamente para testear si se pueden enviar un mail.
router.put("/signin/:id", async (req, res) => {
  let result = "";
  const { email, password } = req.body;
  const { id } = req.params;
  try {
    const payload = {
      id,
      email,
      password,
    };
    const tokenGenerado = await seguridadModel.generarJwtTemporizado(payload);
    if (tokenGenerado) {
      result = await mailSender.enviarEmailTextoPlano(
        email,
        "Prueba de envio de correo electrónico",
        `http://localhost:3000/api/v1/docentes/c/${tokenGenerado}`
      );
      // result = await mailSender.enviarMailConBoton(email, tokenGenerado);
    }
    res.status(200).json({
      status: "success",
      msg: "¡Correo enviado exitósamente!",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
});

/**
 * Ruta para la creación del usuario.
 */
router.get("/c/:token", async (req, res) => {
  const { token } = req.params;
  let docenteCreado = "";
  try {
    const decryptedToken = await seguridadModel.decrypToken(token);
    if (decryptedToken && decryptedToken.payload) {
      const userInformation = decryptedToken.payload;
      docenteCreado = await docenteModel.newUsuarioDocente(
        userInformation.id,
        userInformation.email,
        userInformation.password
      );
    }
    res.status(200).json({ status: "success", docenteCreado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // get: confirmed

/**
 * Ruta para el inicio de sesión de un usuario.
 */
router.post("/login", async (req, res) => {
  let notificarMail = null;
  const { email, password } = req.body;
  try {
    const existeMail = await usuarioModel.encontrarPorEmail(email);
    if (existeMail) {
      // Correo existe.
      if (existeMail?.usuario?.estado === "Activo") {
        // El usuario está activo.
        const esContraCorrecta = await usuarioModel.comparePassword(
          password,
          existeMail?.usuario?.password
        );
        if (esContraCorrecta) {
          // La contraseña es correcta.
          const { _id } = existeMail;
          const { email, tipo } = existeMail?.usuario;
          const payload = {
            jwt: jwt.sign({ _id, email, tipo }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            }),
            user: { _id, email, tipo },
          };
          if (payload?.jwt) {
            notificarMail = await mailSender.enviarEmailTextoPlano(
              email,
              "Inicio de sesión",
              `Han iniciado sesión desde ${req.get(
                "User-Agent"
              )} el ${new Date()}`
            );
          }
          res.status(200).json({ status: "success", payload, notificarMail });
        }
        // La contraseña es incorrecta.
        else
          res.status(500).json({
            status: "failed",
            msg: "Usuario o contraseña incorrecta. Por favor revisá tus datos ingresados.",
            error: 077,
          });
      }
      // El usuario no está activo.
      else
        res.status(500).json({
          status: "failed",
          msg: "Error al iniciar sesión. Por favor, intentalo más tarde.",
          error: 075,
        });
    }
    // No existe el correo electrónico en la base de datos.
    else
      res.status(500).json({
        status: "failed",
        msg: "Error al iniciar sesión. Por favor, intentalo más tarde.",
        error: 070,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "failed" });
  }
}); // post: login

//Ruta para actualizar los usuarios de docentes,
router.put("/updateuser/:identidad", async (req, res) => {
  try {
    const { estado, email, tipo, password } = req.body;
    const { identidad } = req.params;

    const rslt = await docenteModel.updateUser(
      identidad,
      email,
      password,
      estado,
      tipo
    );
    res.status(200).json({ status: "ok", rslt });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});
// post: /sigin

// Ruta para desactivar el usuario de un docente
router.put("/editUserStatus/:id", async (req, res) => {
  try {
    const { usuario } = req.body;
    const { id } = req.params;
    const result = await docenteModel.updateUserStatus(id, usuario);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

//Ruta para activar el usuario de un docente
router.put("/editUserStatusV/:id", async (req, res) => {
  try {
    const { usuario } = req.body;
    const { id } = req.params;
    const result = await docenteModel.updateUserStatusV(id, usuario);
    res.status(200).json({
      status: "ok",
      result,
    });
  } catch (ex) {
    console.log(ex);
    res.status(500).json({ status: "failed" });
  }
});

module.exports = router;
