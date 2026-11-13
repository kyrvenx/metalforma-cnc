var express = require('express');
var router = express.Router();

var metalformaController = require(
  '../controllers/metalformaController'
);

router.get(
  '/',
  metalformaController.mostrarEstado
);

router.get(
  '/prueba-bd',
  metalformaController.probarConexion
);

router.post(
  '/contacto',
  metalformaController.recibirContacto
);

module.exports = router;
