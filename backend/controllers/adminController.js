const bcrypt = require('bcrypt');
const pool = require('../bd');
const cloudinary = require('../config/cloudinary');

function subirImagenCloudinary(archivo) {
  return new Promise((resolve, reject) => {
    if (!archivo) {
      return resolve(null);
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'metalforma/proyectos',
        resource_type: 'image'
      },
      (error, resultado) => {
        if (error) {
          return reject(error);
        }

        resolve(resultado.secure_url);
      }
    );

    stream.end(archivo.buffer);
  });
}

async function crearAdministrador(req, res) {
  try {
    const {
      nombre,
      email,
      password
    } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        mensaje:
          'Nombre, email y contraseña son obligatorios'
      });
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    await pool.query(
      `INSERT INTO administradores
       (nombre, email, password_hash)
       VALUES (?, ?, ?)`,
      [
        nombre.trim(),
        email.trim().toLowerCase(),
        passwordHash
      ]
    );

    res.status(201).json({
      mensaje:
        'Administrador creado correctamente'
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        mensaje:
          'Ese email ya está registrado'
      });
    }

    console.error(
      'Error al crear administrador:',
      error
    );

    res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });
  }
}

async function iniciarSesion(req, res) {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        mensaje:
          'Email y contraseña son obligatorios'
      });
    }

    const resultados = await pool.query(
      `SELECT
        id,
        nombre,
        email,
        password_hash
       FROM administradores
       WHERE email = ?`,
      [email.trim().toLowerCase()]
    );

    const administrador = resultados[0];

    if (
      !administrador ||
      !(await bcrypt.compare(
        password,
        administrador.password_hash
      ))
    ) {
      return res.status(401).json({
        mensaje:
          'Email o contraseña incorrectos'
      });
    }

    req.session.administrador = {
      id: administrador.id,
      nombre: administrador.nombre,
      email: administrador.email
    };

    res.json({
      mensaje: 'Login correcto',
      administrador:
        req.session.administrador
    });
  } catch (error) {
    console.error(
      'Error al iniciar sesión:',
      error
    );

    res.status(500).json({
      mensaje:
        'Error interno del servidor'
    });
  }
}

function obtenerSesion(req, res) {
  if (!req.session.administrador) {
    return res.status(401).json({
      autenticado: false
    });
  }

  res.json({
    autenticado: true,
    administrador:
      req.session.administrador
  });
}

function cerrarSesion(req, res) {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        mensaje:
          'No se pudo cerrar la sesión'
      });
    }

    res.clearCookie('connect.sid');

    res.json({
      mensaje:
        'Sesión cerrada correctamente'
    });
  });
}

function mostrarLogin(req, res) {
  if (req.session.administrador) {
    return res.redirect('/admin/panel');
  }

  res.render('admin-login', {
    title:
      'Acceso administrativo | MetalForma CNC',
    error: null
  });
}

async function procesarLoginWeb(req, res) {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).render(
        'admin-login',
        {
          title:
            'Acceso administrativo | MetalForma CNC',
          error:
            'Email y contraseña son obligatorios'
        }
      );
    }

    const resultados = await pool.query(
      `SELECT
        id,
        nombre,
        email,
        password_hash
       FROM administradores
       WHERE email = ?`,
      [email.trim().toLowerCase()]
    );

    const administrador = resultados[0];

    if (
      !administrador ||
      !(await bcrypt.compare(
        password,
        administrador.password_hash
      ))
    ) {
      return res.status(401).render(
        'admin-login',
        {
          title:
            'Acceso administrativo | MetalForma CNC',
          error:
            'Email o contraseña incorrectos'
        }
      );
    }

    req.session.administrador = {
      id: administrador.id,
      nombre: administrador.nombre,
      email: administrador.email
    };

    req.session.save(() => {
      res.redirect('/admin/panel');
    });
  } catch (error) {
    console.error(
      'Error en el login web:',
      error
    );

    res.status(500).render(
      'admin-login',
      {
        title:
          'Acceso administrativo | MetalForma CNC',
        error:
          'No se pudo iniciar sesión. Revisá la conexión con la base de datos.'
      }
    );
  }
}

async function mostrarPanel(req, res) {
  try {
    const novedades = await pool.query(
      `SELECT
        id,
        titulo,
        descripcion,
        imagen,
        fecha_creacion
       FROM novedades
       ORDER BY id ASC`
    );

    res.render(
      'admin-dashboard',
      {
        title:
          'Panel administrativo | MetalForma CNC',
        administrador:
          req.session.administrador,
        novedades,
        mensaje:
          req.query.mensaje || null,
        error:
          req.query.error || null
      }
    );
  } catch (error) {
    console.error(
      'Error al cargar el panel:',
      error
    );

    res.status(500).render(
      'error',
      {
        message:
          'No se pudo cargar el panel administrativo',
        error:
          process.env.NODE_ENV === 'development'
            ? error
            : {}
      }
    );
  }
}

function cerrarSesionWeb(req, res) {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send(
        'No se pudo cerrar la sesión'
      );
    }

    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
}

async function crearNovedadWeb(req, res) {
  try {
    const {
      titulo,
      descripcion
    } = req.body;

    if (!titulo || !descripcion) {
      return res.redirect(
        '/admin/panel?error=El título y la descripción son obligatorios'
      );
    }

    const imagenUrl =
      await subirImagenCloudinary(req.file);

    await pool.query(
      `INSERT INTO novedades
       (titulo, descripcion, imagen)
       VALUES (?, ?, ?)`,
      [
        titulo.trim(),
        descripcion.trim(),
        imagenUrl
      ]
    );

    res.redirect(
      '/admin/panel?mensaje=Proyecto creado correctamente'
    );
  } catch (error) {
    console.error(
      'Error al crear proyecto:',
      error
    );

    res.redirect(
      '/admin/panel?error=No se pudo subir la imagen o crear el proyecto'
    );
  }
}

async function actualizarNovedadWeb(req, res) {
  try {
    const {
      titulo,
      descripcion
    } = req.body;

    if (!titulo || !descripcion) {
      return res.redirect(
        '/admin/panel?error=El título y la descripción son obligatorios'
      );
    }

    let imagenUrl;

    if (req.file) {
      imagenUrl =
        await subirImagenCloudinary(req.file);
    } else {
      const resultados = await pool.query(
        `SELECT imagen
         FROM novedades
         WHERE id = ?`,
        [req.params.id]
      );

      imagenUrl =
        resultados[0]?.imagen || null;
    }

    await pool.query(
      `UPDATE novedades
       SET titulo = ?,
           descripcion = ?,
           imagen = ?
       WHERE id = ?`,
      [
        titulo.trim(),
        descripcion.trim(),
        imagenUrl,
        req.params.id
      ]
    );

    res.redirect(
      '/admin/panel?mensaje=Proyecto actualizado correctamente'
    );
  } catch (error) {
    console.error(
      'Error al actualizar proyecto:',
      error
    );

    res.redirect(
      '/admin/panel?error=No se pudo subir la imagen o actualizar el proyecto'
    );
  }
}

async function eliminarNovedadWeb(req, res) {
  try {
    await pool.query(
      'DELETE FROM novedades WHERE id = ?',
      [req.params.id]
    );

    res.redirect(
      '/admin/panel?mensaje=Proyecto eliminado correctamente'
    );
  } catch (error) {
    console.error(
      'Error al eliminar proyecto:',
      error
    );

    res.redirect(
      '/admin/panel?error=No se pudo eliminar el proyecto'
    );
  }
}

module.exports = {
  crearAdministrador,
  iniciarSesion,
  obtenerSesion,
  cerrarSesion,
  mostrarLogin,
  procesarLoginWeb,
  mostrarPanel,
  cerrarSesionWeb,
  crearNovedadWeb,
  actualizarNovedadWeb,
  eliminarNovedadWeb
};