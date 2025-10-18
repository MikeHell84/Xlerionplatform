// backend/middleware/validationMiddleware.js

/**
 * Middleware para validar los datos de configuración del sitio.
 */
const validateSettings = (req, res, next) => {
  const settings = req.body;
  const allowedFonts = ["-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", "Georgia, serif", "monospace"];
  const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

  for (const key in settings) {
    const value = settings[key];

    if (key.includes('_color') && !hexColorRegex.test(value)) {
      return res.status(400).json({ message: `El valor para ${key} no es un color hexadecimal válido.` });
    }

    if (key === 'font_family' && !allowedFonts.includes(value)) {
      return res.status(400).json({ message: `La fuente '${value}' no está permitida.` });
    }

    if (key === 'border_radius' && (isNaN(parseInt(value, 10)) || value < 0 || value > 24)) {
        return res.status(400).json({ message: `El valor para border_radius debe ser un número entre 0 y 24.` });
    }
  }

  next();
};

/**
 * Middleware para validar la creación de una sección.
 */
const validateSection = async (req, res, next) => {
    const { name, slug } = req.body;

    if (!name || name.trim() === '' || !slug || slug.trim() === '') {
        return res.status(400).json({ message: 'El nombre y el slug no pueden estar vacíos.' });
    }

    // Evitar duplicados
    const { pool } = require('../config/db');
    const [existing] = await pool.query('SELECT id FROM sections WHERE name = ? OR slug = ?', [name, slug]);
    if (existing.length > 0) {
        return res.status(409).json({ message: 'Ya existe una sección con ese nombre o slug.' }); // 409 Conflict
    }

    next();
};

module.exports = { validateSettings, validateSection };