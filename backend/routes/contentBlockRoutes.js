// backend/routes/contentBlockRoutes.js
import express from 'express';
const router = express.Router();
import {
    getAllContentBlocks,
    getContentBlockById,
    createContentBlock,
    updateContentBlock,
    deleteContentBlock,
    updateBlockOrder
} from '../controllers/contentBlockController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Usaremos un middleware de subida centralizado

router.route('/')
    .get(protect, authorizeAdmin, getAllContentBlocks)
    .post(protect, authorizeAdmin, upload.single('image'), createContentBlock);

router.route('/:id')
    .get(protect, authorizeAdmin, getContentBlockById)
    .put(protect, authorizeAdmin, upload.single('image'), updateContentBlock)
    .delete(protect, authorizeAdmin, deleteContentBlock);

router.put('/order', protect, authorizeAdmin, updateBlockOrder);

export default router;