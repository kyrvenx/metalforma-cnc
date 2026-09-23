const bd = require('../bd');

const mostrarEstado = (req, res) => {
  res.json({
    mensaje: 'Backend de Transportes X funcionando correctamente'
  });
};

const recibirContacto = async (req, res, next) => {
  const { nombre, email, telefono, mensaje } = req.body;

  try {
    const resultado = await bd.query(
      'INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES (?, ?, ?, ?)',
      [nombre, email, telefono, mensaje]
    );

    res.json({
      mensaje: 'Datos de contacto guardados correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    next(error);
  }
};

const probarConexion = async (req, res, next) => {
  try {
    await bd.query('SELECT 1');
    res.json({ mensaje: 'Conexión con MySQL funcionando correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  mostrarEstado,
  recibirContacto,
  probarConexion
};
