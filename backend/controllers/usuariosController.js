const bcrypt = require('bcrypt');
const pool = require('../bd');

async function registrarUsuario(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje: 'Nombre, email y contraseña son obligatorios'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuariosExistentes = await pool.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [emailNormalizado]
    );

    if (usuariosExistentes.length > 0) {
      return res.status(409).json({
        mensaje: 'Ese correo ya está registrado'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, email, password_hash)
       VALUES (?, ?, ?)`,
      [nombre.trim(), emailNormalizado, passwordHash]
    );

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: resultado.insertId,
        nombre: nombre.trim(),
        email: emailNormalizado
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
}

async function iniciarSesionUsuario(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje: 'Email y contraseña son obligatorios'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const resultados = await pool.query(
      `SELECT id, nombre, email, password_hash
       FROM usuarios
       WHERE email = ?`,
      [emailNormalizado]
    );

    if (resultados.length === 0) {
      return res.status(401).json({
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    const usuario = resultados[0];

    const passwordCorrecta = await bcrypt.compare(
      password,
      usuario.password_hash
    );

    if (!passwordCorrecta) {
      return res.status(401).json({
        mensaje: 'Email o contraseña incorrectos'
      });
    }

    req.session.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email
    };

    res.json({
      mensaje: 'Inicio de sesión correcto',
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Error al iniciar sesión como usuario:', error);

    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
}

function obtenerSesionUsuario(req, res) {
  if (!req.session.usuario) {
    return res.status(401).json({
      autenticado: false
    });
  }

  res.json({
    autenticado: true,
    usuario: req.session.usuario
  });
}

function cerrarSesionUsuario(req, res) {
  delete req.session.usuario;

  res.json({
    mensaje: 'Sesión de usuario cerrada correctamente'
  });
}

module.exports = {
  registrarUsuario,
  iniciarSesionUsuario,
  obtenerSesionUsuario,
  cerrarSesionUsuario
};
