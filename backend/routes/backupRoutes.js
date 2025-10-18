// backend/routes/backupRoutes.js
import express from 'express';
import multer from 'multer';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
    createBackup,
    getBackups,
    downloadBackup,
    deleteBackup,
    restoreBackup
} from '../controllers/backupController.js';

const router = express.Router();

// Configure multer for file uploads (for restore)
const upload = multer({ dest: 'backups/uploads/' });

router.route('/')
    .get(protect, authorizeAdmin, getBackups)
    .post(protect, authorizeAdmin, createBackup);

router.post('/restore', protect, authorizeAdmin, upload.single('backupFile'), restoreBackup);

router.route('/:filename')
    .get(protect, authorizeAdmin, downloadBackup)
    .delete(protect, authorizeAdmin, deleteBackup);

export default router;