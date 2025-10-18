// backend/services/siteSettingsService.js

// En una aplicación real, esto interactuaría con una base de datos (MongoDB, PostgreSQL, etc.).
// Por ahora, usaremos un objeto de ejemplo para simular los datos.
const mockSettings = {
    siteName: 'Ultimate Website',
    tagline: 'Tu solución definitiva para todo.',
    maintenanceMode: false,
    logoUrl: '/images/logo.png'
};

/**
 * @desc    Obtiene la configuración pública del sitio desde la base de datos.
 * @returns {Promise<object>} Un objeto con la configuración pública.
 */
const getPublicSettings = async () => {
    // Simula una llamada asíncrona a la base de datos.
    return Promise.resolve(mockSettings);
};

module.exports = {
    getPublicSettings
};