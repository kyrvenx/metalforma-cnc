function requerirUsuario(req, res, next) {
  if (!req.session || !req.session.usuario) {
    return res.status(401).json({
      mensaje: 'Debes iniciar sesión como usuario'
    });
  }

  next();
}

function requerirAdministrador(req, res, next) {
  if (!req.session || !req.session.administrador) {
    return res.status(401).json({
      mensaje: 'Acceso administrativo requerido'
    });
  }

  next();
}

module.exports = {
  requerirUsuario,
  requerirAdministrador
};
