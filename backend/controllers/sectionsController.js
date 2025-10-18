// backend/controllers/sectionsController.js
import { pool } from '../config/db.js';
import cache from '../services/cacheService.js';

// Helper to clear the public menu cache
const clearMenuCache = () => {
    cache.clear('public_menu');
};

/**
 * @desc    Obtener todas las secciones
 * @route   GET /api/sections
 * @access  Private/Admin
 */
export const getAllSections = async (req, res) => {
    try {
        const [sections] = await pool.query('SELECT * FROM sections ORDER BY name ASC');
        res.json(sections);
    } catch (error) {
        console.error('Error al obtener las secciones:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Crear o actualizar una sección
 * @route   POST /api/sections, PUT /api/sections/:id
 * @access  Private/Admin
 */
export const saveSection = async (req, res) => {
    const { id } = req.params; // For updates
    const { name, slug, icon, description, status } = req.body;

    if (!name || !slug) {
        return res.status(400).json({ message: 'El nombre y el slug son obligatorios.' });
    }

    try {
        if (id) {
            // Update existing section
            await pool.query(
                'UPDATE sections SET name = ?, slug = ?, icon = ?, description = ?, status = ? WHERE id = ?',
                [name, slug, icon, description, status, id]
            );
            clearMenuCache();
            res.json({ message: 'Sección actualizada con éxito.' });
        } else {
            // Create new section
            const [result] = await pool.query(
                'INSERT INTO sections (name, slug, icon, description, status) VALUES (?, ?, ?, ?, ?)',
                [name, slug, icon, description, status]
            );
            clearMenuCache();
            res.status(201).json({ id: result.insertId, message: 'Sección creada con éxito.' });
        }
    } catch (error) {
        console.error('Error al guardar la sección:', error);
        res.status(500).json({ message: 'Error del servidor al guardar la sección.' });
    }
};