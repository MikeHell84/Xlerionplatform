import express from 'express';
const router = express.Router();
import {
    getLanguages,
    addLanguage,
    deleteLanguage,
    getTranslations,
    updateTranslations
} from '../controllers/i18nController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/languages')
    .get(protect, getLanguages)
    .post(protect, addLanguage);

router.route('/languages/:code')
    .delete(protect, deleteLanguage);

router.route('/translations/:lang')
    .get(protect, getTranslations)
    .put(protect, updateTranslations);

export default router;