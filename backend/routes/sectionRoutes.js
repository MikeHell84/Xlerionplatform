// backend/routes/sectionRoutes.js
import express from 'express';
const router = express.Router();
import { getAllSections, saveSection } from '../controllers/sectionsController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, authorizeAdmin, getAllSections)
    .post(protect, authorizeAdmin, saveSection); // POST /api/sections (Crear)

router.route('/:id').put(protect, authorizeAdmin, saveSection); // PUT /api/sections/:id (Actualizar)
export default router;