const pool = require('../bd');
const resend = require('../config/resend');

function escaparHtml(texto = '') {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function enviarCorreoSolicitud({
  usuario,
  telefono,
  mensaje,
  piezas,
  solicitudId
}) {
  const listaPiezas = piezas.length
    ? piezas
        .map(
          (pieza) =>
            `<li>${escaparHtml(pieza.nombre)} — cantidad: ${escaparHtml(
              pieza.cantidad
            )}</li>`
        )
        .join('')
    : '<li>Consulta general sin piezas seleccionadas</li>';

  await resend.emails.send({
    from: process.env.RESEND_FROM,
    to: process.env.RESEND_TO,
    subject: `Nueva solicitud de presupuesto #${solicitudId}`,
    html: `
      <h2>Nueva solicitud de presupuesto</h2>

      <p><strong>Número de solicitud:</strong> ${solicitudId}</p>
      <p><strong>Cliente:</strong> ${escaparHtml(usuario.nombre)}</p>
      <p><strong>Email:</strong> ${escaparHtml(usuario.email)}</p>
      <p><strong>Teléfono:</strong> ${escaparHtml(telefono || 'No indicado')}</p>

      <p><strong>Detalle del proyecto:</strong></p>
      <p>${escaparHtml(mensaje)}</p>

      <p><strong>Piezas solicitadas:</strong></p>
      <ul>
        ${listaPiezas}
      </ul>
    `
  });
}

async function crearSolicitud(req, res) {
  const { telefono, mensaje, piezas } = req.body;
  const usuario = req.session.usuario;

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
        usuario.id,
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

    try {
      await enviarCorreoSolicitud({
        usuario,
        telefono,
        mensaje: mensaje.trim(),
        piezas: Array.isArray(piezas) ? piezas : [],
        solicitudId
      });
    } catch (errorCorreo) {
      console.error(
        'La solicitud se guardó, pero no se pudo enviar el correo:',
        errorCorreo
      );
    }

    res.status(201).json({
      mensaje: 'Solicitud enviada correctamente',
      solicitudId
    });
  } catch (error) {
    console.error(
      'Error al crear solicitud:',
      error
    );

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
    console.error(
      'Error al listar solicitudes:',
      error
    );

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
    console.error(
      'Error al listar solicitudes administrativas:',
      error
    );

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
    console.error(
      'Error al actualizar estado:',
      error
    );

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