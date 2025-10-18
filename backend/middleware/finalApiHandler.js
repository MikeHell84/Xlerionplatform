// backend/middleware/finalApiHandler.js

/**
 * Middleware final para las rutas de la API.
 * Si ninguna ruta de la API coincide, este middleware se ejecuta y envía una
 * respuesta 404 JSON en lugar de dejar que Express envíe una página HTML.
 * Esto evita los errores de Content Security Policy en la consola del navegador
 * cuando las herramientas de desarrollo intentan acceder a rutas inexistentes.
 * @param {object} req - El objeto de solicitud de Express.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {function} next - La función para pasar al siguiente middleware.
 */
function finalApiHandler(req, res, next) {
    res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

module.exports = finalApiHandler;