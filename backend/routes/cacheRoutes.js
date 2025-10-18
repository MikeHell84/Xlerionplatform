// backend/routes/cacheRoutes.js
const express = require('express');
const router = express.Router();
const { clearAllCache, clearSpecificCaches } = require('../controllers/cacheController');

router.post('/clear-all', clearAllCache);
router.post('/clear-specific', clearSpecificCaches);

module.exports = router;