// backend/controllers/authController.js
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/**
 * @desc    Autenticar un usuario y obtener un token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length > 0 && (await bcrypt.compare(password, users[0].password))) {
            const user = users[0];
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id),
            });
        } else {
            res.status(401).json({ message: 'Email o contraseña inválidos.' });
        }
    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Registrar un nuevo usuario
 * @route   POST /api/users/register
 * @access  Public (o solo para el primer admin)
 */
export const registerUser = async (req, res) => {
    const { name, email, password, role = 'editor' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Por favor, complete todos los campos.' });
    }

    try {
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        const newUser = { id: result.insertId, name, email, role };

        res.status(201).json({
            ...newUser,
            token: generateToken(newUser.id),
        });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Manejar la solicitud de olvido de contraseña
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
    // Implementación futura: generar token, guardar en DB y enviar email.
    res.status(501).json({ message: 'Funcionalidad de olvido de contraseña no implementada.' });
};

/**
 * @desc    Restablecer la contraseña
 * @route   POST /api/users/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
    // Implementación futura: verificar token y actualizar contraseña.
    res.status(501).json({ message: 'Funcionalidad de restablecimiento de contraseña no implementada.' });
};