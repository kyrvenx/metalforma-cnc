const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');

const {
  requerirAdministrador
} = require('../middleware/auth');

const upload = require('../middleware/upload');

router.get(
  '/login',
  adminController.mostrarLogin
);

router.post(
  '/login',
  adminController.procesarLoginWeb
);

router.get(
  '/panel',
  requerirAdministrador,
  adminController.mostrarPanel
);

router.post(
  '/panel/logout',
  requerirAdministrador,
  adminController.cerrarSesionWeb
);

router.post(
  '/panel/novedades',
  requerirAdministrador,
  upload.single('imagen'),
  adminController.crearNovedadWeb
);

router.post(
  '/panel/novedades/:id/editar',
  requerirAdministrador,
  upload.single('imagen'),
  adminController.actualizarNovedadWeb
);

router.post(
  '/panel/novedades/:id/eliminar',
  requerirAdministrador,
  adminController.eliminarNovedadWeb
);

module.exports = router;  