// backend/services/contentBlockService.js

const mockContentBlocks = [
    { id: 1, title: 'Welcome Block', content: '<p>Welcome to our amazing website!</p>', isActive: true, area: 'header' },
    { id: 2, title: 'About Us Snippet', content: '<h4>About Us</h4><p>We are a team of passionate developers.</p>', isActive: true, area: 'sidebar' },
    { id: 3, title: 'Old Promo', content: '<p>This promotion has expired.</p>', isActive: false, area: 'footer' }
];

/**
 * @desc    Obtiene los bloques de contenido que están activos.
 * @returns {Promise<object[]>} Un array de bloques de contenido activos.
 */
const getActiveContentBlocks = async () => {
    // Simula una llamada a la base de datos para filtrar solo los bloques activos.
    const activeBlocks = mockContentBlocks.filter(block => block.isActive);
    return Promise.resolve(activeBlocks);
};

module.exports = {
    getActiveContentBlocks
};