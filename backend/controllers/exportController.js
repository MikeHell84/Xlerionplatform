// backend/controllers/exportController.js
const { pool } = require('../config/db');
const { Parser } = require('json2csv');

/**
 * Extrae el valor de un campo JSON para un idioma específico, con un fallback al primer idioma disponible.
 * @param {string|object} jsonData - El objeto o string JSON.
 * @param {string} langCode - El código de idioma preferido (ej. 'es').
 * @returns {string} El valor del texto.
 */
function getLocalizedValue(jsonData, langCode = 'es') {
    if (!jsonData) return '';
    try {
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
        if (data[langCode]) {
            return data[langCode];
        }
        // Fallback al primer idioma que encuentre si el preferido no existe
        const firstKey = Object.keys(data)[0];
        return data[firstKey] || '';
    } catch (e) {
        return '';
    }
}

/**
 * @desc    Exportar todos los posts a un archivo CSV.
 * @route   GET /api/export/posts
 * @access  Admin
 */
const exportPostsToCsv = async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT p.id, p.title, p.post_data, p.status, p.publish_at, p.created_at, s.name as section_name
            FROM posts p
            JOIN sections s ON p.section_id = s.id
            ORDER BY p.created_at DESC
        `);

        // Aplanar los datos para el CSV, extrayendo el contenido en español.
        const flattenedPosts = posts.map(post => {
            const postData = post.post_data ? JSON.parse(post.post_data) : {};
            return {
                id: post.id,
                titulo: getLocalizedValue(post.title, 'es'),
                seccion: post.section_name,
                estado: post.status,
                fecha_publicacion: post.publish_at,
                fecha_creacion: post.created_at,
                // Añadir campos específicos del post_data que quieras exportar
                contenido: (getLocalizedValue(postData.content, 'es') || '').substring(0, 100) + '...', // Ejemplo: solo un extracto
                url_imagen_destacada: getLocalizedValue(postData.featured_image_url, 'es'),
            };
        });

        const fields = [
            'id',
            'titulo',
            'seccion',
            'estado',
            'fecha_publicacion',
            'fecha_creacion',
            'contenido',
            'url_imagen_destacada'
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(flattenedPosts);

        res.header('Content-Type', 'text/csv');
        res.attachment('posts-export.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error al exportar posts a CSV:', error);
        res.status(500).json({ message: 'Error interno del servidor al exportar los datos.' });
    }
};

module.exports = { exportPostsToCsv };