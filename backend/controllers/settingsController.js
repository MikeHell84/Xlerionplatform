// backend/controllers/settingsController.js
import { pool } from '../config/db.js';
import cache from '../services/cacheService.js';

// Helper to clear public settings cache
const clearSettingsCache = () => {
    cache.clear('public_settings');
};

/**
 * @desc    Obtener toda la configuración del sitio
 * @route   GET /api/settings
 * @access  Private
 */
export const getSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM site_settings');
        const settings = rows.reduce((acc, { setting_key, setting_value }) => {
            acc[setting_key] = setting_value;
            return acc;
        }, {});
        res.json(settings);
    } catch (error) {
        console.error('Error al obtener la configuración:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Actualizar la configuración del sitio
 * @route   PUT /api/settings
 * @access  Private/Admin
 */
export const updateSettings = async (req, res) => {
    const settings = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (const key in settings) {
            // Asegurarse de que la clave existe en la tabla antes de actualizar
            await connection.query(
                'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, settings[key], settings[key]]
            );
        }
        await connection.commit();
        clearSettingsCache();
        res.json({ message: 'Configuración actualizada con éxito.' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al actualizar la configuración:', error);
        res.status(500).json({ message: 'Error del servidor al actualizar la configuración.' });
    } finally {
        connection.release();
    }
};

/**
 * @desc    Middleware para subir una imagen y guardar su ruta en la configuración.
 * @param   {string} settingKey - La clave de configuración a actualizar (ej. 'site_logo').
 */
export const uploadImage = (settingKey) => async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    await pool.query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [imageUrl, settingKey]);
    clearSettingsCache();
    res.json({ message: 'Imagen subida y configuración actualizada.', imageUrl });
};