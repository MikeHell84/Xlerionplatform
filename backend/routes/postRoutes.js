// backend/routes/postRoutes.js
import express from 'express';
const router = express.Router();
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

// All post routes should be protected
router.use(protect);
router.use(authorizeAdmin); // And only accessible by admins

router.route('/').get(getPosts).post(createPost);
router.route('/:id').get(getPostById).put(updatePost).delete(deletePost);

export default router;