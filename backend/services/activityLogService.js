// backend/services/activityLogService.js
const { pool } = require('../config/db');

/**
 * Registra una acción en el log de actividad.
 * @param {number | null} userId - El ID del usuario que realiza la acción. Puede ser null si la acción es del sistema.
 * @param {string} action - Una descripción corta de la acción (ej: 'INICIO_SESION', 'POST_CREADO').
 * @param {string} details - Detalles adicionales sobre la acción (ej: `Post ID: 1, Título: "Nuevo Post"`).
 */
async function logActivity(userId, action, details = '') {
    try {
        let userName = 'Sistema';
        if (userId) {
            // Obtenemos el nombre del usuario para desnormalizarlo y que el log sea legible incluso si el usuario se elimina.
            const [[user]] = await pool.query('SELECT name FROM users WHERE id = ?', [userId]);
            if (user) {
                userName = user.name;
            }
        }
        
        await pool.query(
            'INSERT INTO activity_log (user_id, user_name, action, details) VALUES (?, ?, ?, ?)',
            [userId, userName, action, details]
        );
    } catch (error) {
        console.error('Error al registrar la actividad:', error);
        // No lanzamos el error para no interrumpir la operación principal del usuario.
    }
}

module.exports = { logActivity };