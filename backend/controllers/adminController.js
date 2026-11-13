const bcrypt = require('bcrypt');
const pool = require('../bd');

async function crearAdministrador(req, res) {
  try {
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO administradores (nombre, email, password_hash)
      VALUES (?, ?, ?)
    `;

    await pool.query(sql, [nombre, email, passwordHash]);

    res.status(201).json({ mensaje: 'Administrador creado correctamente' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ mensaje: 'Ese email ya está registrado' });
    }

    console.error('Error al crear administrador:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

async function iniciarSesion(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios' });
    }

    const resultados = await pool.query(
      'SELECT id, nombre, email, password_hash FROM administradores WHERE email = ?',
      [email]
    );

    if (resultados.length === 0) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const administrador = resultados[0];
    const passwordCorrecta = await bcrypt.compare(password, administrador.password_hash);

    if (!passwordCorrecta) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    req.session.administrador = {
      id: administrador.id,
      nombre: administrador.nombre,
      email: administrador.email
    };

    res.json({
      mensaje: 'Login correcto',
      administrador: req.session.administrador
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
}

function obtenerSesion(req, res) {
  if (!req.session.administrador) {
    return res.status(401).json({ autenticado: false });
  }

  res.json({
    autenticado: true,
    administrador: req.session.administrador
  });
}

function cerrarSesion(req, res) {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error al cerrar sesión:', error);
      return res.status(500).json({ mensaje: 'No se pudo cerrar la sesión' });
    }

    res.clearCookie('connect.sid');
    res.json({ mensaje: 'Sesión cerrada correctamente' });
  });
}

module.exports = {
  crearAdministrador,
  iniciarSesion,
  obtenerSesion,
  cerrarSesion
};