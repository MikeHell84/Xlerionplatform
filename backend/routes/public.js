// backend/routes/public.js
const express = require('express');
const router = express.Router();
const { getSiteSettings, getMenuItems, getPublicContentBlocks, getPublicSocialLinks, getHomeContent, getActiveBlocks, getPostBySlug } = require('../controllers/publicController');
router.get('/menu', getMenuItems);
router.get('/content-blocks', getPublicContentBlocks);
router.get('/social-links', getPublicSocialLinks);
router.get('/home-content', getHomeContent);
router.get('/active-blocks', getActiveBlocks);

router.get('/posts/:slug', getPostBySlug);

module.exports = router;