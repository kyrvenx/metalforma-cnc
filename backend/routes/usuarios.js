const express = require('express');
const router = express.Router();

const usuariosController = require('../controllers/usuariosController');

router.post('/registro', usuariosController.registrarUsuario);

router.post('/login', usuariosController.iniciarSesionUsuario);

router.get('/sesion', usuariosController.obtenerSesionUsuario);

router.post('/logout', usuariosController.cerrarSesionUsuario);

module.exports = router;
