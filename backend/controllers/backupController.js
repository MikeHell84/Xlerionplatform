// backend/controllers/backupController.js
import mysqldump from 'mysqldump';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { pool } from '../config/db.js';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const backupDir = path.join(__dirname, '..', '..', 'backups');

// Asegurarse de que el directorio de backups exista
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// @desc    Crear una nueva copia de seguridad
// @route   POST /api/backups
// @access  Private/Admin
export const createBackup = async (req, res) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup-${timestamp}.sql`;
    const filePath = path.join(backupDir, fileName);

    try {
        await mysqldump({
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
            },
            dumpToFile: filePath,
        });
        res.status(201).json({ message: 'Copia de seguridad creada con éxito.', file: fileName });
    } catch (error) {
        console.error('Error al crear la copia de seguridad:', error);
        res.status(500).json({ message: 'Error del servidor al crear la copia de seguridad.' });
    }
};

// @desc    Obtener la lista de copias de seguridad
// @route   GET /api/backups
// @access  Private/Admin
export const getBackups = (req, res) => {
    fs.readdir(backupDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'No se pudo leer el directorio de backups.' });
        }
        const backupFiles = files
            .filter(file => file.endsWith('.sql'))
            .map(file => {
                const stats = fs.statSync(path.join(backupDir, file));
                return {
                    filename: file,
                    size: stats.size,
                    createdAt: stats.birthtime,
                };
            })
            .sort((a, b) => b.createdAt - a.createdAt); // Más recientes primero
        res.json(backupFiles);
    });
};

// @desc    Descargar una copia de seguridad
// @route   GET /api/backups/:filename
// @access  Private/Admin
export const downloadBackup = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(backupDir, filename);

    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'Archivo no encontrado.' });
    }
};

// @desc    Eliminar una copia de seguridad
// @route   DELETE /api/backups/:filename
// @access  Private/Admin
export const deleteBackup = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(backupDir, filename);

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ message: 'Error al eliminar el archivo.' });
        res.json({ message: 'Copia de seguridad eliminada con éxito.' });
    });
};

// @desc    Restaurar una copia de seguridad desde un archivo
// @route   POST /api/backups/restore
// @access  Private/Admin
export const restoreBackup = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
    }

    const filePath = req.file.path;

    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        await pool.query(sql);

        // Limpiar el archivo temporal después de la restauración
        fs.unlinkSync(filePath);

        res.json({ message: 'Base de datos restaurada con éxito. Se recomienda recargar la página.' });
    } catch (error) {
        console.error('Error al restaurar la base de datos:', error);
        res.status(500).json({ message: 'Error del servidor al restaurar la base de datos.' });
    }
};