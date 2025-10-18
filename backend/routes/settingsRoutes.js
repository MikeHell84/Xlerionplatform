// backend/routes/settingsRoutes.js
import express from 'express';
const router = express.Router();
import { getSettings, updateSettings, uploadImage } from '../controllers/settingsController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Usar el middleware centralizado

// GET /api/settings: Solo requiere estar logueado (admin o editor) para ver la configuración en el panel.
// PUT /api/settings: Requiere ser admin para poder modificar la configuración.
router.route('/')
    .get(protect, getSettings)
    .put(protect, authorizeAdmin, updateSettings);

router.post('/upload-logo', protect, authorizeAdmin, upload.single('logoFile'), uploadImage('site_logo'));
router.post('/upload-hero', protect, authorizeAdmin, upload.single('heroImageFile'), uploadImage('hero_background_image'));

export default router;