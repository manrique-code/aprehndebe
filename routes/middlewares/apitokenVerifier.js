const verificarApiTokenHeader = (req, res, next) => {
  const apitoken = req.get("apitoken");
  if (apitoken) {
    if (apitoken === process.env.API_TOKEN) {
      return next();
    } else {
      return enviarNoAutorizado(res);
    }
  } else return enviarNoAutorizado(res);
};

const enviarNoAutorizado = (res) => {
  return res.status(401).json({ error: 401, msg: "¡Recurzo no autorizado!" });
};

module.exports = { verificarApiTokenHeader };
