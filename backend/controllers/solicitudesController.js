const pool = require('../bd');

async function crearSolicitud(req, res) {
  const { telefono, mensaje, piezas } = req.body;
  const usuarioId = req.session.usuario.id;

  if (!mensaje || !mensaje.trim()) {
    return res.status(400).json({
      mensaje: 'El detalle del proyecto es obligatorio'
    });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO solicitudes
       (usuario_id, telefono, mensaje)
       VALUES (?, ?, ?)`,
      [
        usuarioId,
        telefono || null,
        mensaje.trim()
      ]
    );

    const solicitudId = resultado.insertId;

    if (Array.isArray(piezas)) {
      for (const pieza of piezas) {
        if (!pieza.nombre || !pieza.cantidad) {
          continue;
        }

        await pool.query(
          `INSERT INTO solicitud_items
           (solicitud_id, nombre_pieza, cantidad)
           VALUES (?, ?, ?)`,
          [
            solicitudId,
            pieza.nombre,
            Number(pieza.cantidad)
          ]
        );
      }
    }

    res.status(201).json({
      mensaje: 'Solicitud enviada correctamente',
      solicitudId
    });
  } catch (error) {
    console.error('Error al crear solicitud:', error);

    res.status(500).json({
      mensaje: 'No se pudo guardar la solicitud'
    });
  }
}

async function listarMisSolicitudes(req, res) {
  const usuarioId = req.session.usuario.id;

  try {
    const solicitudes = await pool.query(
      `SELECT
        id,
        telefono,
        mensaje,
        estado,
        fecha_creacion
       FROM solicitudes
       WHERE usuario_id = ?
       ORDER BY fecha_creacion DESC`,
      [usuarioId]
    );

    for (const solicitud of solicitudes) {
      solicitud.piezas = await pool.query(
        `SELECT
          nombre_pieza AS nombre,
          cantidad
         FROM solicitud_items
         WHERE solicitud_id = ?
         ORDER BY id ASC`,
        [solicitud.id]
      );
    }

    res.json(solicitudes);
  } catch (error) {
    console.error('Error al listar solicitudes:', error);

    res.status(500).json({
      mensaje: 'No se pudieron cargar tus solicitudes'
    });
  }
}

async function listarTodasLasSolicitudes(req, res) {
  try {
    const solicitudes = await pool.query(
      `SELECT
        s.id,
        s.telefono,
        s.mensaje,
        s.estado,
        s.fecha_creacion,
        u.nombre AS usuario_nombre,
        u.email AS usuario_email
       FROM solicitudes s
       INNER JOIN usuarios u
         ON u.id = s.usuario_id
       ORDER BY s.fecha_creacion DESC`
    );

    for (const solicitud of solicitudes) {
      solicitud.piezas = await pool.query(
        `SELECT
          nombre_pieza AS nombre,
          cantidad
         FROM solicitud_items
         WHERE solicitud_id = ?
         ORDER BY id ASC`,
        [solicitud.id]
      );
    }

    res.json(solicitudes);
  } catch (error) {
    console.error('Error al listar solicitudes administrativas:', error);

    res.status(500).json({
      mensaje: 'No se pudieron cargar las solicitudes'
    });
  }
}

async function actualizarEstadoSolicitud(req, res) {
  const estadosPermitidos = [
    'pendiente',
    'contactado',
    'finalizada'
  ];

  const { estado } = req.body;
  const { id } = req.params;

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      mensaje: 'Estado de solicitud inválido'
    });
  }

  try {
    const resultado = await pool.query(
      `UPDATE solicitudes
       SET estado = ?
       WHERE id = ?`,
      [estado, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Solicitud no encontrada'
      });
    }

    res.json({
      mensaje: 'Estado actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);

    res.status(500).json({
      mensaje: 'No se pudo actualizar el estado'
    });
  }
}

module.exports = {
  crearSolicitud,
  listarMisSolicitudes,
  listarTodasLasSolicitudes,
  actualizarEstadoSolicitud
};
