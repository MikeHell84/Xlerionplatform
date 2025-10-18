// Cargar variables de entorno lo antes posible
import 'dotenv/config';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import helmet from 'helmet';
import { testConnection } from './config/db.js'; // Importar testConnection
import apiRoutes from './routes/api.js';
import publicRoutes from './routes/publicRoutes.js';

// Reemplazo para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const app = express();

// --- Middlewares de Seguridad ---
app.use(cors()); // Habilita CORS para todas las rutas

// Configuración de Content Security Policy (CSP) con Helmet
// Esto soluciona los errores de fuentes y scripts bloqueados.
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "https://cdn.jsdelivr.net", "https://cdn.tiny.cloud"],
      "font-src": ["'self'", "https://cdnjs.cloudflare.com"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      "connect-src": ["'self'", "http://localhost:3000", "https://sp.tinymce.com", "https://cdn.jsdelivr.net"],
      "img-src": ["'self'", "data:", "http://localhost:3000", "https://sp.tinymce.com"],
    },
  })
);

// --- Middlewares Generales ---
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: false })); // Para parsear form-data

// --- Rutas de la API (deben ir ANTES de las rutas estáticas y del catch-all) ---
app.use('/api/public', publicRoutes);
app.use('/api', apiRoutes);

// --- Servir Archivos Estáticos ---

// 1. Servir la carpeta 'public' del backend (subidas de imágenes) bajo la ruta '/uploads'.
app.use('/uploads', express.static(path.join(__dirname, 'public')));

// 2. Servir los assets del frontend público (CSS, JS, imágenes).
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// 3. Servir el panel de administración (SPA).
app.use('/admin', express.static(path.join(__dirname, '../frontend/admin')));
app.get(/^\/admin/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/admin/index.html'));
});

// 4. Ruta "Catch-all" para el frontend público (SPA).
// Se usa una expresión regular para interceptar cualquier ruta que NO comience con /api.
// Esto evita que las rutas del frontend interfieran con la API y soluciona el error de `path-to-regexp`.
// Es crucial para que el enrutamiento del lado del cliente funcione correctamente.
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Middleware para manejar rutas no encontradas (404).
// Debe ir después de todas las demás rutas.
app.use((req, res, next) => {
    res.status(404).json({ message: `No se encontró la ruta: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 3000;

// Función principal para iniciar el servidor
const startServer = async () => {
  await testConnection(); // Probar la conexión a la BD antes de iniciar
  app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

startServer();