import express from 'express';
const router = express.Router();

// Handler para la raíz de la API
router.get('/', (req, res) => {
    res.json({
        message: 'Bienvenido a la API privada de Ultimate Website.',
        version: '1.0.0',
        description: 'Esta es la raíz de la API. Los endpoints específicos se encuentran en sub-rutas como /users, /posts, etc.'
    });
});

// Importar todas las rutas de los módulos
import userRoutes from './userRoutes.js';
import postRoutes from './postRoutes.js';
import sectionRoutes from './sectionRoutes.js';
import i18nRoutes from './i18nRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import emailSettingsRoutes from './emailSettingsRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import backupRoutes from './backupRoutes.js';
import commentRoutes from './commentRoutes.js';
import contentBlockRoutes from './contentBlockRoutes.js';
import socialLinkRoutes from './socialLinkRoutes.js';
import seoRoutes from './seoRoutes.js';

// Registrar todas las rutas privadas bajo /api
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/sections', sectionRoutes);
router.use('/i18n', i18nRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/email-settings', emailSettingsRoutes);
router.use('/settings', settingsRoutes);
router.use('/backups', backupRoutes);
router.use('/comments', commentRoutes);
router.use('/content-blocks', contentBlockRoutes);
router.use('/social-links', socialLinkRoutes);
router.use('/seo', seoRoutes);

export default router;