// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

/**
 * Middleware para proteger rutas que requieren autenticación.
 * Verifica el token JWT enviado en la cabecera de autorización.
 */
export const protect = async (req, res, next) => {
  let token;

  // Permitir token desde la cabecera o como parámetro de consulta (para descargas)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {
      // 2. Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Obtener el usuario de la base de datos (sin la contraseña) y adjuntarlo al objeto `req`
      const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [parseInt(decoded.id, 10)]);
      
      if (rows.length === 0) {
        return res.status(401).json({ message: 'No autorizado, el usuario ya no existe' });
      }
      
      req.user = rows[0];
      next(); // Pasa al siguiente middleware o controlador
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se proporcionó un token' });
  }
};

/**
 * Middleware para autorizar solo a usuarios con rol de 'admin'.
 * Debe usarse después del middleware `protect`.
 */
export const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};