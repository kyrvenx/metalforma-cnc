const pool = require('../bd');

function verificarAdministrador(req, res) {
  if (!req.session || !req.session.administrador) {
    res.status(401).json({
      mensaje: 'Acceso administrativo requerido'
    });

    return false;
  }

  return true;
}

async function listarNovedades(req, res) {
  try {
    const resultados = await pool.query(
      `SELECT id, titulo, descripcion, imagen, fecha_creacion
       FROM novedades
       ORDER BY id ASC`
    );

    res.json(resultados);
  } catch (error) {
    console.error('Error al listar novedades:', error);

    res.status(500).json({
      mensaje: 'Error interno al listar novedades'
    });
  }
}

async function crearNovedad(req, res) {
  if (!verificarAdministrador(req, res)) return;

  try {
    const { titulo, descripcion, imagen } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({
        mensaje: 'El título y la descripción son obligatorios'
      });
    }

    const resultado = await pool.query(
      `INSERT INTO novedades (titulo, descripcion, imagen)
       VALUES (?, ?, ?)`,
      [titulo, descripcion, imagen || null]
    );

    const nuevaNovedad = await pool.query(
      `SELECT id, titulo, descripcion, imagen, fecha_creacion
       FROM novedades
       WHERE id = ?`,
      [resultado.insertId]
    );

    res.status(201).json({
      mensaje: 'Novedad creada correctamente',
      novedad: nuevaNovedad[0]
    });
  } catch (error) {
    console.error('Error al crear novedad:', error);

    res.status(500).json({
      mensaje: 'Error interno al crear novedad'
    });
  }
}

async function actualizarNovedad(req, res) {
  if (!verificarAdministrador(req, res)) return;

  try {
    const { id } = req.params;
    const { titulo, descripcion, imagen } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({
        mensaje: 'El título y la descripción son obligatorios'
      });
    }

    const resultado = await pool.query(
      `UPDATE novedades
       SET titulo = ?, descripcion = ?, imagen = ?
       WHERE id = ?`,
      [titulo, descripcion, imagen || null, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Novedad no encontrada'
      });
    }

    const novedadActualizada = await pool.query(
      `SELECT id, titulo, descripcion, imagen, fecha_creacion
       FROM novedades
       WHERE id = ?`,
      [id]
    );

    res.json({
      mensaje: 'Novedad actualizada correctamente',
      novedad: novedadActualizada[0]
    });
  } catch (error) {
    console.error('Error al actualizar novedad:', error);

    res.status(500).json({
      mensaje: 'Error interno al actualizar novedad'
    });
  }
}

async function eliminarNovedad(req, res) {
  if (!verificarAdministrador(req, res)) return;

  try {
    const { id } = req.params;

    const resultado = await pool.query(
      'DELETE FROM novedades WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Novedad no encontrada'
      });
    }

    res.json({
      mensaje: 'Novedad eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar novedad:', error);

    res.status(500).json({
      mensaje: 'Error interno al eliminar novedad'
    });
  }
}

module.exports = {
  listarNovedades,
  crearNovedad,
  actualizarNovedad,
  eliminarNovedad
};
