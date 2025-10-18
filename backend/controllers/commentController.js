// backend/controllers/commentController.js
import { pool } from '../config/db.js';

/**
 * @desc    Obtener todos los comentarios, opcionalmente filtrados por estado.
 * @route   GET /api/comments
 * @access  Private/Admin
 */
export const getComments = async (req, res) => {
    try {
        let query = `
            SELECT c.id, c.author_name, c.content, c.status, c.created_at, p.title as post_title
            FROM comments c
            JOIN posts p ON c.post_id = p.id
        `;
        const params = [];

        if (req.query.status) {
            query += ' WHERE c.status = ?';
            params.push(req.query.status);
        }

        query += ' ORDER BY c.created_at DESC';

        const [comments] = await pool.query(query, params);
        res.json(comments);
    } catch (error) {
        console.error('Error al obtener los comentarios:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Actualizar el estado de un comentario (aprobar/rechazar).
 * @route   PATCH /api/comments/:id/status
 * @access  Private/Admin
 */
export const updateCommentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Estado no válido.' });
    }

    try {
        await pool.query('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: `Comentario actualizado a "${status}".` });
    } catch (error) {
        console.error('Error al actualizar el estado del comentario:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Eliminar un comentario.
 * @route   DELETE /api/comments/:id
 * @access  Private/Admin
 */
export const deleteComment = async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ message: 'Comentario eliminado con éxito.' });
};