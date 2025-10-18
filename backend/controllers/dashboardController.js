// backend/controllers/dashboardController.js
import { pool } from '../config/db.js';

/**
 * @desc    Obtener estadísticas generales para el dashboard.
 * @route   GET /api/dashboard/stats
 * @access  Private
 */
export const getDashboardStats = async (req, res) => {
    try {
        const [posts] = await pool.query("SELECT COUNT(*) as count FROM posts");
        const [sections] = await pool.query("SELECT COUNT(*) as count FROM sections");
        const [pendingComments] = await pool.query("SELECT COUNT(*) as count FROM comments WHERE status = 'pending'");
        const [users] = await pool.query("SELECT COUNT(*) as count FROM users");

        res.json({
            posts: posts[0].count,
            sections: sections[0].count,
            pendingComments: pendingComments[0].count,
            users: users[0].count,
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Obtener datos de vistas a lo largo del tiempo.
 * @route   GET /api/dashboard/views-over-time
 * @access  Private
 */
export const getViewsOverTime = async (req, res) => {
    try {
        const [views] = await pool.query(`
            SELECT view_date, SUM(view_count) as views 
            FROM page_views 
            WHERE view_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) 
            GROUP BY view_date 
            ORDER BY view_date ASC
        `);
        res.json(views);
    } catch (error) {
        console.error('Error fetching views over time:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Obtener estadísticas de posts por categoría (sección).
 * @route   GET /api/dashboard/posts-by-category
 * @access  Private
 */
export const getPostsByCategoryStats = async (req, res) => {
    try {
        const [stats] = await pool.query(`
            SELECT s.name, COUNT(p.id) as postCount 
            FROM sections s 
            LEFT JOIN posts p ON s.id = p.section_id 
            GROUP BY s.id 
            ORDER BY postCount DESC
        `);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching posts by category stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Obtener estadísticas de comentarios por post.
 * @route   GET /api/dashboard/comments-by-post
 * @access  Private
 */
export const getCommentsByPostStats = async (req, res) => {
    // This can be an expensive query on large datasets.
    // We'll just return an empty array for now as a placeholder.
    // A more performant implementation might be needed later.
    res.json([]);
};