// backend/routes/dashboardRoutes.js
import express from 'express';
const router = express.Router();
import { getDashboardStats, getViewsOverTime, getPostsByCategoryStats, getCommentsByPostStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

// @route   GET /api/dashboard/stats
router.get('/stats', protect, getDashboardStats);
router.get('/views-over-time', protect, getViewsOverTime);
router.get('/posts-by-category', protect, getPostsByCategoryStats);
router.get('/comments-by-post', protect, getCommentsByPostStats);

export default router;