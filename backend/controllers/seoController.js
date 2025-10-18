// backend/controllers/seoController.js
import { pool } from '../config/db.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * @desc    Generar el sitemap.xml
 * @route   POST /api/seo/sitemap
 * @access  Private/Admin
 */
export const generateSitemap = async (req, res) => {
    try {
        // Asumimos que la URL base del sitio está en la configuración.
        // Si no, usamos un valor por defecto.
        const [settings] = await pool.query("SELECT setting_value FROM site_settings WHERE setting_key = 'site_url'");
        const baseUrl = settings.length > 0 && settings[0].setting_value ? settings[0].setting_value : 'http://localhost:5000';

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // 1. Página de inicio
        xml += `  <url><loc>${baseUrl}/</loc><priority>1.0</priority></url>\n`;

        // 2. Secciones
        const [sections] = await pool.query("SELECT slug FROM sections WHERE status = 'active'");
        for (const section of sections) {
            xml += `  <url><loc>${baseUrl}/section/${section.slug}</loc><priority>0.8</priority></url>\n`;
        }

        // 3. Posts
        const [posts] = await pool.query("SELECT slug FROM posts WHERE status = 'published'");
        for (const post of posts) {
            xml += `  <url><loc>${baseUrl}/post/${post.slug}</loc><priority>0.6</priority></url>\n`;
        }

        xml += '</urlset>';

        // Guardar el archivo en la carpeta pública del frontend para que sea accesible.
        // La ruta asume que la carpeta 'frontend' está al mismo nivel que 'backend'.
        const sitemapPath = path.join(process.cwd(), 'frontend', 'sitemap.xml');
        await fs.writeFile(sitemapPath, xml);

        res.json({ message: 'sitemap.xml generado con éxito.' });

    } catch (error) {
        console.error('Error al generar el sitemap:', error);
        res.status(500).json({ message: 'Error del servidor al generar el sitemap.' });
    }
};