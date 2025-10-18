// backend/controllers/socialLinkController.js
import { pool } from '../config/db.js';
import cache from '../services/cacheService.js';

// Helper to clear public social links cache
const clearSocialLinksCache = () => {
    cache.clear('social_links');
};

/**
 * @desc    Obtener todos los enlaces sociales
 * @route   GET /api/social-links
 * @access  Private
 */
export const getSocialLinks = async (req, res) => {
    try {
        const [links] = await pool.query('SELECT * FROM social_links ORDER BY id ASC');
        res.json(links);
    } catch (error) {
        console.error('Error al obtener los enlaces sociales:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Crear un nuevo enlace social
 * @route   POST /api/social-links
 * @access  Private
 */
export const createSocialLink = async (req, res) => {
    const { name, url, icon_class } = req.body;
    if (!name || !url || !icon_class) {
        return res.status(400).json({ message: 'Nombre, URL e icono son obligatorios.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO social_links (name, url, icon_class) VALUES (?, ?, ?)',
            [name, url, icon_class]
        );
        clearSocialLinksCache();
        res.status(201).json({ id: result.insertId, message: 'Enlace social creado con éxito.' });
    } catch (error) {
        console.error('Error al crear el enlace social:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Actualizar un enlace social
 * @route   PUT /api/social-links/:id
 * @access  Private
 */
export const updateSocialLink = async (req, res) => {
    const { id } = req.params;
    const { name, url, icon_class } = req.body;
    await pool.query('UPDATE social_links SET name = ?, url = ?, icon_class = ? WHERE id = ?', [name, url, icon_class, id]);
    clearSocialLinksCache();
    res.json({ message: 'Enlace social actualizado con éxito.' });
};

/**
 * @desc    Eliminar un enlace social
 * @route   DELETE /api/social-links/:id
 * @access  Private
 */
export const deleteSocialLink = async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM social_links WHERE id = ?', [id]);
    clearSocialLinksCache();
    res.json({ message: 'Enlace social eliminado con éxito.' });
};