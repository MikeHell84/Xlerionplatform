// backend/controllers/activityLogController.js
const { pool } = require('../config/db');

/**
 * @desc    Obtener el registro de actividad paginado.
 * @route   GET /api/activity-log
 * @access  Admin
 */
const getActivityLog = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const offset = (page - 1) * limit;

        const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM activity_log');
        const [logs] = await pool.query('SELECT * FROM activity_log ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);

        res.json({ logs, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (error) {
        console.error('Error al obtener el registro de actividad:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

module.exports = { getActivityLog };