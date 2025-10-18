// backend/routes/seoRoutes.js
import express from 'express';
const router = express.Router();
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';
import { generateSitemap } from '../controllers/seoController.js';

router.post('/sitemap', protect, authorizeAdmin, generateSitemap);

export default router;