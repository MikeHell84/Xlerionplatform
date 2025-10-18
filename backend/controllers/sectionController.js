// backend/controllers/sectionController.js
const { pool } = require('../config/db');
const cache = require('../services/cacheService');

// @desc    Obtener todas las secciones
// @route   GET /api/sections
// @access  Private
const getSections = async (req, res) => {
  const [sections] = await pool.query('SELECT * FROM sections ORDER BY name ASC');
  res.json(sections);
};

// @desc    Crear una nueva sección
// @route   POST /api/sections
// @access  Private
const createSection = async (req, res) => {
  const { name, slug, description, icon, status } = req.body;
  if (!name || !slug) {
    return res.status(400).json({ message: 'El nombre y el slug son requeridos' });
  }

  const [result] = await pool.query(
    'INSERT INTO sections (name, slug, description, icon, status) VALUES (?, ?, ?, ?, ?)',
    [name, slug, description, icon, status || 'inactive']
  );

  const [newSection] = await pool.query('SELECT * FROM sections WHERE id = ?', [result.insertId]);

  // Limpiar la caché del menú para que la nueva sección pueda aparecer
  cache.clear('menu_sections');
  res.status(201).json(newSection[0]);
};

// @desc    Actualizar una sección
// @route   PUT /api/sections/:id
// @access  Private
const updateSection = async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, icon, status } = req.body;

  await pool.query(
    'UPDATE sections SET name = ?, slug = ?, description = ?, icon = ?, status = ? WHERE id = ?',
    [name, slug, description, icon, status, id]
  );

  const [updatedSection] = await pool.query('SELECT * FROM sections WHERE id = ?', [id]);

  // Limpiar la caché del menú para reflejar los cambios
  cache.clear('menu_sections');
  res.json(updatedSection[0]);
};

// @desc    Eliminar una sección
// @route   DELETE /api/sections/:id
// @access  Private
const deleteSection = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM sections WHERE id = ?', [id]);

  // Limpiar la caché del menú ya que una sección ha sido eliminada
  cache.clear('menu_sections');
  res.json({ message: 'Sección eliminada con éxito' });
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
};