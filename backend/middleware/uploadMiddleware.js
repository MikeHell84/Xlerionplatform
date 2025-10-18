// backend/middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define el directorio de almacenamiento para las subidas
const storageDir = path.join(process.cwd(), 'backend', 'public', 'uploads');

// Asegúrate de que el directorio de subidas exista
if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storageDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

export default upload;