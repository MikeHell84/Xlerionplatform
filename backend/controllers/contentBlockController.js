// backend/controllers/contentBlockController.js
import { pool } from '../config/db.js';
import cache from '../services/cacheService.js';

const clearContentBlockCache = () => {
    cache.clear('public_content_blocks');
};

export const getAllContentBlocks = async (req, res) => {
    try {
        const [blocks] = await pool.query('SELECT * FROM content_blocks ORDER BY sort_order ASC');
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content blocks.' });
    }
};

export const getContentBlockById = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM content_blocks WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Content block not found.' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching content block.' });
    }
};

export const createContentBlock = async (req, res) => {
    const { type, title, content, cta_text, cta_link, is_active, background_color, text_color } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const [result] = await pool.query(
            'INSERT INTO content_blocks (type, title, content, image_url, cta_text, cta_link, is_active, background_color, text_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [type, title, content, image_url, cta_text, cta_link, is_active || 1, background_color, text_color]
        );
        clearContentBlockCache();
        res.status(201).json({ id: result.insertId, message: 'Content block created.' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating content block.' });
    }
};

export const updateContentBlock = async (req, res) => {
    const { id } = req.params;
    const { type, title, content, cta_text, cta_link, is_active, background_color, text_color } = req.body;
    
    let query = 'UPDATE content_blocks SET type=?, title=?, content=?, cta_text=?, cta_link=?, is_active=?, background_color=?, text_color=?';
    const params = [type, title, content, cta_text, cta_link, is_active, background_color, text_color];

    if (req.file) {
        query += ', image_url=?';
        params.push(`/uploads/${req.file.filename}`);
    }

    query += ' WHERE id=?';
    params.push(id);

    try {
        await pool.query(query, params);
        clearContentBlockCache();
        res.json({ message: 'Content block updated.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating content block.' });
    }
};

export const deleteContentBlock = async (req, res) => {
    try {
        await pool.query('DELETE FROM content_blocks WHERE id = ?', [req.params.id]);
        clearContentBlockCache();
        res.json({ message: 'Content block deleted.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting content block.' });
    }
};

export const updateBlockOrder = async (req, res) => {
    const { order } = req.body; // Espera un array de IDs en el orden deseado: [3, 1, 2]
    if (!Array.isArray(order)) {
        return res.status(400).json({ message: 'Invalid order format.' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (let i = 0; i < order.length; i++) {
            await connection.query('UPDATE content_blocks SET sort_order = ? WHERE id = ?', [i, order[i]]);
        }
        await connection.commit();
        clearContentBlockCache();
        res.json({ message: 'Block order updated successfully.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ message: 'Failed to update block order.' });
    } finally {
        connection.release();
    }
};