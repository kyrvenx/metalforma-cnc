const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/crear', adminController.crearAdministrador);
router.post('/login', adminController.iniciarSesion);
router.get('/sesion', adminController.obtenerSesion);
router.post('/logout', adminController.cerrarSesion);

module.exports = router;