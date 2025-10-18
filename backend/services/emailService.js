// backend/services/emailService.js
import nodemailer from 'nodemailer';
import { pool } from '../config/db.js';

/**
 * Crea y configura un transportador de Nodemailer basado en la configuración de la base de datos.
 * @returns {Promise<import('nodemailer').Transporter>}
 */
async function getTransporter() {
    const [rows] = await pool.query("SELECT setting_key, setting_value FROM site_settings WHERE setting_key LIKE 'smtp_%'");
    const settings = rows.reduce((acc, { setting_key, setting_value }) => {
        acc[setting_key] = setting_value;
        return acc;
    }, {});

    if (!settings.smtp_host || !settings.smtp_port || !settings.smtp_user || !settings.smtp_pass) {
        throw new Error('La configuración SMTP no está completa. Por favor, verifique los ajustes en el panel de administración.');
    }

    return nodemailer.createTransport({
        host: settings.smtp_host,
        port: parseInt(settings.smtp_port, 10),
        secure: settings.smtp_secure === 'true' || settings.smtp_secure === '1',
        auth: {
            user: settings.smtp_user,
            pass: settings.smtp_pass,
        },
    });
}

/**
 * Envía un correo electrónico utilizando la configuración del sitio.
 * @param {object} options - Opciones para el correo (to, subject, text, html).
 */
export const sendEmail = async (options) => {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(options);
    console.log('Email sent: %s', info.messageId);
    return info;
};