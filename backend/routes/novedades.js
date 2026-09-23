const express = require('express');
const router = express.Router();

const novedadesController = require('../controllers/novedadesController');

router.get('/', novedadesController.listarNovedades);

router.post('/', novedadesController.crearNovedad);

router.put('/:id', novedadesController.actualizarNovedad);

router.delete('/:id', novedadesController.eliminarNovedad);

module.exports = router;
