// backend/routes/commentRoutes.js
import express from 'express';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';
import {
    getComments,
    updateCommentStatus,
    deleteComment
} from '../controllers/commentController.js';

const router = express.Router();

router.route('/')
    .get(protect, authorizeAdmin, getComments);

router.route('/:id/status').patch(protect, authorizeAdmin, updateCommentStatus);
router.route('/:id').delete(protect, authorizeAdmin, deleteComment);

export default router;