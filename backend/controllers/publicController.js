// backend/controllers/publicController.js
import { pool } from '../config/db.js';
import cache from '../services/cacheService.js';

/**
 * @desc    Obtiene las secciones activas para el menú de navegación.
 * @route   GET /api/public/menu
 * @access  Public
 */
export const getMenu = async (req, res) => {
    try {
        const cacheKey = 'public_menu';
        const cachedMenu = cache.get(cacheKey);
        if (cachedMenu) return res.json(cachedMenu);

        const [sections] = await pool.query("SELECT name, slug, icon FROM sections WHERE status = 'active' ORDER BY name ASC");
        cache.set(cacheKey, sections);
        res.json(sections);
    } catch (error) {
        console.error('Error al obtener el menú:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @desc    Obtener la configuración pública del sitio.
 * @route   GET /api/public/settings
 * @access  Public
 */
export const getPublicSettings = async (req, res) => {
    try {
        const cacheKey = 'public_settings';
        const cachedSettings = cache.get(cacheKey);
        if (cachedSettings) return res.json(cachedSettings);

        const [rows] = await pool.query('SELECT * FROM site_settings');
        const settings = rows.reduce((acc, row) => {
            acc[row.setting_key] = row.setting_value;
            return acc;
        }, {});
        cache.set(cacheKey, settings);
        res.json(settings);
    } catch (error) {
        console.error('Error al obtener la configuración pública:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @desc    Obtener los bloques de contenido públicos y activos.
 * @route   GET /api/public/content-blocks
 * @access  Public
 */
export const getPublicContentBlocks = async (req, res) => {
    try {
        const cacheKey = 'public_content_blocks';
        const cachedBlocks = cache.get(cacheKey);
        if (cachedBlocks) return res.json(cachedBlocks);

        const [blocks] = await pool.query("SELECT * FROM content_blocks WHERE is_active = 1 ORDER BY sort_order ASC");
        cache.set(cacheKey, blocks);
        res.json(blocks);
    } catch (error) {
        console.error('Error al obtener los bloques de contenido:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @desc    Obtiene las traducciones para un idioma específico.
 * @route   GET /api/public/translations/:lang
 * @access  Public
 */
export const getPublicTranslations = async (req, res) => {
    const { lang } = req.params;
    const cacheKey = `translations_${lang}`;
    const cachedTranslations = cache.get(cacheKey);
    if (cachedTranslations) return res.json(cachedTranslations);

    try {
        const [rows] = await pool.query('SELECT translation_key, translation_value FROM translations WHERE lang_code = ?', [lang]);
        const translations = rows.reduce((acc, row) => {
            acc[row.translation_key] = row.translation_value;
            return acc;
        }, {});
        cache.set(cacheKey, translations);
        res.json(translations);
    } catch (error) {
        console.error(`Error al obtener traducciones para ${lang}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @desc    Obtiene los posts publicados de una sección por su slug.
 * @route   GET /api/public/sections/:slug/posts
 * @access  Public
 */
export const getPostsBySectionSlug = async (req, res) => {
    const { slug } = req.params;
    const cacheKey = `posts_section_${slug}`;
    
    try {
        const cachedPosts = cache.get(cacheKey);
        if (cachedPosts) return res.json(cachedPosts);

        const [posts] = await pool.query(`
            SELECT p.title, p.slug as post_slug, p.post_data, p.smart_summary, p.created_at, s.name as section_name
            FROM posts p
            JOIN sections s ON p.section_id = s.id
            WHERE s.slug = ? AND p.status = 'published'
            ORDER BY p.created_at DESC
        `, [slug]);

        cache.set(cacheKey, posts);
        res.json(posts);
    } catch (error) {
        console.error(`Error al obtener posts para la sección ${slug}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @desc    Obtiene un post publicado por su slug.
 * @route   GET /api/public/posts/:slug
 * @access  Public
 */
export const getPostBySlug = async (req, res) => {
    const { slug } = req.params;
    const cacheKey = `post_detail_${slug}`;

    try {
        const cachedPost = cache.get(cacheKey);
        if (cachedPost) return res.json(cachedPost);

        const [posts] = await pool.query(`
            SELECT 
                p.title, 
                p.slug as post_slug, 
                p.post_data, 
                p.created_at, 
                s.name as section_name, 
                s.slug as section_slug
            FROM posts p
            JOIN sections s ON p.section_id = s.id
            WHERE p.slug = ? AND p.status = 'published'
        `, [slug]);

        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post no encontrado.' });
        }

        const post = posts[0];
        cache.set(cacheKey, post);
        res.json(post);
    } catch (error) {
        console.error(`Error al obtener el post con slug ${slug}:`, error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

/**
 * @desc    Obtiene los enlaces a redes sociales públicos.
 * @route   GET /api/public/social-links
 * @access  Public
 */
export const getPublicSocialLinks = async (req, res) => {
    const cacheKey = 'social_links';
    try {
        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            return res.json(cachedData);
        }

        const [links] = await pool.query('SELECT name, url, icon_class FROM social_links ORDER BY id ASC');
        cache.set(cacheKey, links);
        res.json(links);
    } catch (error) {
        console.error('Error fetching social links:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};