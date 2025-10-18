import express from 'express';
const router = express.Router();
import { getPublicSettings, getPublicContentBlocks, getPublicTranslations, getMenu, getPostsBySectionSlug, getPostBySlug, getPublicSocialLinks } from '../controllers/publicController.js';

router.get('/settings', getPublicSettings);
router.get('/content-blocks', getPublicContentBlocks);
router.get('/translations/:lang', getPublicTranslations);
router.get('/menu', getMenu);
router.get('/sections/:slug/posts', getPostsBySectionSlug);
router.get('/posts/:slug', getPostBySlug);
// Añadimos la ruta para obtener los enlaces sociales
router.get('/social-links', getPublicSocialLinks);

export default router;