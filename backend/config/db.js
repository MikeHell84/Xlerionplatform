// backend/config/db.js
import mysql from 'mysql2/promise';

/**
 * Pool de conexiones a la base de datos MySQL.
 * Usar un pool es más eficiente que crear una conexión por cada consulta,
 * ya que reutiliza las conexiones existentes.
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  multipleStatements: true, // Necesario para ejecutar scripts de restauración
  connectionLimit: 10, // Número máximo de conexiones en el pool
  queueLimit: 0,
  charset: 'utf8mb4' // Asegura que la conexión maneje caracteres especiales correctamente
});

/**
 * Función para probar la conexión a la base de datos.
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión a la base de datos MySQL establecida con éxito.');
    connection.release(); // Libera la conexión de vuelta al pool
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    // Si la conexión falla, el proceso debe terminar para evitar errores mayores.
    process.exit(1);
  }
}

// Exportamos el pool para usarlo en otras partes de la aplicación
// y la función de prueba para llamarla al inicio.
export { pool, testConnection };
