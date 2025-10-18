// backend/controllers/emailSettingsController.js
import { pool } from '../config/db.js';
import { sendEmail } from '../services/emailService.js';

/**
 * @desc    Obtener la configuración de email.
 * @route   GET /api/email-settings
 * @access  Private
 */
export const getEmailSettings = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE 'smtp_%'");
        const settings = rows.reduce((acc, { setting_key, setting_value }) => {
            // Convertir 'true'/'false' a booleano para el checkbox
            if (setting_key === 'smtp_secure') {
                acc[setting_key] = setting_value === 'true' || setting_value === '1';
            } else {
                acc[setting_key] = setting_value;
            }
            return acc;
        }, {});
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener la configuración de email.' });
    }
};

/**
 * @desc    Actualizar la configuración de email.
 * @route   PUT /api/email-settings
 * @access  Private
 */
export const updateEmailSettings = async (req, res) => {
    const settings = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (const key in settings) {
            if (key.startsWith('smtp_')) {
                await connection.query('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [String(settings[key]), key]);
            }
        }
        await connection.commit();
        res.json({ message: 'Configuración de email actualizada con éxito.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Error al actualizar la configuración de email.' });
    } finally {
        connection.release();
    }
};

/**
 * @desc    Enviar un email de prueba.
 * @route   POST /api/email-settings/test
 * @access  Private
 */
export const sendTestEmailController = async (req, res) => {
    const userEmail = req.user.email;
    await sendEmail({ to: userEmail, subject: 'Email de Prueba - Ultimate Website', text: 'Si recibes este email, la configuración SMTP funciona correctamente.' });
    res.json({ message: `Email de prueba enviado a ${userEmail}.` });
};