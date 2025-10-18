const { pool } = require('../config/db');
const cache = require('../services/cacheService');

/**
 * @desc    Obtener todos los comentarios para moderación.
 * @route   GET /api/comments
 * @access  Private
 */
const getAllComments = async (req, res) => {
    try {
        const [comments] = await pool.query(`
            SELECT c.id, c.author_name, c.content, c.status, c.created_at, p.title AS post_title
            FROM comments c
            JOIN posts p ON c.post_id = p.id
            ORDER BY c.created_at DESC
        `);
        res.json(comments);
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        res.status(500).json({ message: 'Error del servidor al obtener los comentarios.' });
    }
};

/**
 * @desc    Actualizar el estado de un comentario (aprobar, rechazar).
 * @route   PUT /api/comments/:id
 * @access  Private
 */
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved', 'rejected', 'pending'

        await pool.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
        
        res.json({ message: 'Comentario actualizado con éxito.' });
    } catch (error) {
        console.error('Error al actualizar el comentario:', error);
        res.status(500).json({ message: 'Error del servidor al actualizar el comentario.' });
    }
};

/**
 * @desc    Eliminar un comentario.
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM comments WHERE id = ?', [id]);
        res.json({ message: 'Comentario eliminado con éxito.' });
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        res.status(500).json({ message: 'Error del servidor al eliminar el comentario.' });
    }
};

module.exports = {
    getAllComments,
    updateComment,
    deleteComment
};