import express from 'express';
const router = express.Router();
import {
    getEmailSettings,
    updateEmailSettings,
    sendTestEmailController
} from '../controllers/emailSettingsController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getEmailSettings)
    .put(protect, updateEmailSettings);

router.post('/test', protect, sendTestEmailController);

export default router;