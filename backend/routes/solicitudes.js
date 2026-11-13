const express = require('express');
const router = express.Router();

const solicitudesController = require(
  '../controllers/solicitudesController'
);

const {
  requerirUsuario,
  requerirAdministrador
} = require('../middleware/auth');

router.post(
  '/',
  requerirUsuario,
  solicitudesController.crearSolicitud
);

router.get(
  '/mis-solicitudes',
  requerirUsuario,
  solicitudesController.listarMisSolicitudes
);

router.get(
  '/admin',
  requerirAdministrador,
  solicitudesController.listarTodasLasSolicitudes
);

router.put(
  '/admin/:id/estado',
  requerirAdministrador,
  solicitudesController.actualizarEstadoSolicitud
);

module.exports = router;
