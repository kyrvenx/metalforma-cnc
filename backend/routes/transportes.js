var express = require('express');
var router = express.Router();
var transportesController = require('../controllers/transportesController');

router.get('/', transportesController.mostrarEstado);
router.get('/prueba-bd', transportesController.probarConexion);
router.post('/contacto', transportesController.recibirContacto);

module.exports = router;
