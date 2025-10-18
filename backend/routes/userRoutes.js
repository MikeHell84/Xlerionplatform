import express from 'express';
const router = express.Router();
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controllers/authController.js';
import { getAllUsers, createUser, updateUser, deleteUser, getMe } from '../controllers/userController.js';
import { protect, authorizeAdmin } from '../middleware/authMiddleware.js';

// Rutas públicas de autenticación (manejadas por authController)
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Ruta privada para obtener datos del usuario logueado
router.get('/me', protect, getMe);

// Rutas de gestión de usuarios (protegidas y solo para admin)
router.route('/')
    .get(protect, authorizeAdmin, getAllUsers)
    .post(protect, authorizeAdmin, createUser);

router.route('/:id')
    .put(protect, authorizeAdmin, updateUser)
    .delete(protect, authorizeAdmin, deleteUser);

export default router;