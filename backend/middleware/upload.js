const multer = require('multer');

const almacenamiento = multer.memoryStorage();

const upload = multer({
  storage: almacenamiento,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, archivo, callback) => {
    const tiposPermitidos = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif'
    ];

    if (!tiposPermitidos.includes(archivo.mimetype)) {
      return callback(
        new Error(
          'Solo se permiten imágenes JPG, PNG, WEBP o GIF'
        )
      );
    }

    callback(null, true);
  }
});

module.exports = upload;