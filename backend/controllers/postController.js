// backend/controllers/postController.js
import { pool } from '../config/db.js';
import cache from '../services/cacheService.js';

// Helper function to clear relevant post caches
const clearPostCaches = async (postId) => {
    try {
        // Find the slug of the post and its section to clear specific caches
        const [rows] = await pool.query(
            `SELECT p.slug as post_slug, s.slug as section_slug 
             FROM posts p 
             JOIN sections s ON p.section_id = s.id 
             WHERE p.id = ?`,
            [postId]
        );

        if (rows.length > 0) {
            const { post_slug, section_slug } = rows[0];
            if (post_slug) cache.clear(`post_detail_${post_slug}`);
            if (section_slug) cache.clear(`posts_section_${section_slug}`);
        }
    } catch (error) {
        console.error(`Error clearing cache for post ${postId}:`, error);
    }
};

/**
 * @desc    Crear un nuevo post
 * @route   POST /api/posts
 * @access  Private
 */
export const createPost = async (req, res) => {
    const { section_id, title, content, post_data, status, publish_at } = req.body;
    // A simple slug generation from the Spanish title
    const slug = title.es.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
        const [result] = await pool.query(
            'INSERT INTO posts (section_id, title, slug, content, post_data, status, publish_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [section_id, JSON.stringify(title), slug, content, JSON.stringify(post_data), status, publish_at || null]
        );
        res.status(201).json({ id: result.insertId, message: 'Post creado con éxito.' });
    } catch (error) {
        console.error('Error al crear el post:', error);
        res.status(500).json({ message: 'Error del servidor al crear el post.' });
    }
};

/**
 * @desc    Obtener todos los posts
 * @route   GET /api/posts
 * @access  Private
 */
export const getPosts = async (req, res) => {
    try {
        const [posts] = await pool.query(`
            SELECT p.id, p.title, p.status, p.created_at, s.name as section_name 
            FROM posts p 
            JOIN sections s ON p.section_id = s.id 
            ORDER BY p.created_at DESC
        `);
        res.json(posts);
    } catch (error) {
        console.error('Error al obtener los posts:', error);
        res.status(500).json({ message: 'Error del servidor al obtener los posts.' });
    }
};

/**
 * @desc    Obtener un post por ID
 * @route   GET /api/posts/:id
 * @access  Private
 */
export const getPostById = async (req, res) => {
    try {
        const [posts] = await pool.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post no encontrado.' });
        }
        res.json(posts[0]);
    } catch (error) {
        console.error('Error al obtener el post:', error);
        res.status(500).json({ message: 'Error del servidor al obtener el post.' });
    }
};

/**
 * @desc    Actualizar un post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
export const updatePost = async (req, res) => {
    const { id } = req.params;
    const { section_id, title, content, post_data, status, publish_at } = req.body;
    const slug = title.es.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

    try {
        await pool.query(
            'UPDATE posts SET section_id = ?, title = ?, slug = ?, content = ?, post_data = ?, status = ?, publish_at = ? WHERE id = ?',
            [section_id, JSON.stringify(title), slug, content, JSON.stringify(post_data), status, publish_at || null, id]
        );
        await clearPostCaches(id);
        res.json({ message: 'Post actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar el post:', error);
        res.status(500).json({ message: 'Error del servidor al actualizar el post.' });
    }
};

/**
 * @desc    Eliminar un post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
export const deletePost = async (req, res) => {
    const { id } = req.params;
    await clearPostCaches(id); // Clear cache before deleting
    await pool.query('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ message: 'Post eliminado con éxito.' });
};