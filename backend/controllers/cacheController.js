// backend/controllers/cacheController.js
const cache = require('../services/cacheService');

// @desc    Limpiar toda la caché
// @route   POST /api/cache/clear-all
// @access  Private/Admin
const clearAllCache = (req, res) => {
    cache.flush();
    console.log('ADMIN ACTION: Toda la caché ha sido limpiada.');
    res.json({ message: 'Toda la caché ha sido limpiada con éxito.' });
};

// @desc    Limpiar cachés específicas por prefijo
// @route   POST /api/cache/clear-specific
// @access  Private/Admin
const clearSpecificCaches = (req, res) => {
    const { prefixes } = req.body; // Espera un array de prefijos
    if (!prefixes || !Array.isArray(prefixes)) {
        return res.status(400).json({ message: 'Se requiere un array de prefijos de caché.' });
    }

    prefixes.forEach(prefix => {
        cache.clearByPrefix(prefix);
    });

    console.log(`ADMIN ACTION: Se limpió la caché para los prefijos: ${prefixes.join(', ')}`);
    res.json({ message: `Caché para '${prefixes.join(', ')}' limpiada con éxito.` });
};

module.exports = { clearAllCache, clearSpecificCaches };