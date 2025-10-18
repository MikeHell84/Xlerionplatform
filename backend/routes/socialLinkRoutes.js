import express from 'express';
const router = express.Router();
import {
    getSocialLinks,
    createSocialLink,
    updateSocialLink,
    deleteSocialLink
} from '../controllers/socialLinkController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

router.route('/')
    .get(protect, getSocialLinks)
    .post(protect, authorizeAdmin, createSocialLink);

router.route('/:id')
    .put(protect, authorizeAdmin, updateSocialLink)
    .delete(protect, authorizeAdmin, deleteSocialLink);

export default router;