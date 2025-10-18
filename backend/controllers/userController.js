// backend/controllers/userController.js
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

/**
 * @desc    Obtener datos del usuario logueado
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMe = async (req, res) => {
    // req.user es adjuntado por el middleware 'protect'
    res.status(200).json(req.user);
};

/**
 * @desc    Obtener todos los usuarios
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Crear un nuevo usuario
 * @route   POST /api/users
 * @access  Private/Admin
 */
export const createUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );
        res.status(201).json({ id: result.insertId, name, email, role });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El email ya está en uso.' });
        }
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Actualizar un usuario
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, role, password } = req.body;

    try {
        let query = 'UPDATE users SET name = ?, email = ?, role = ?';
        const params = [name, email, role];

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            query += ', password = ?';
            params.push(hashedPassword);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await pool.query(query, params);
        res.json({ message: 'Usuario actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor.' });
    }
};

/**
 * @desc    Eliminar un usuario
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'Usuario eliminado con éxito.' });
};