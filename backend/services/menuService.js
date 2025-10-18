// backend/services/menuService.js

const mockMenu = [
    { id: 1, label: 'Inicio', url: '/' },
    { id: 2, label: 'Sobre Nosotros', url: '/sobre-nosotros' },
    { id: 3, label: 'Contacto', url: '/contacto' }
];

/**
 * @desc    Obtiene los items para el menú principal.
 * @returns {Promise<object[]>} Un array de items del menú.
 */
const getMenu = async () => {
    return Promise.resolve(mockMenu);
};

module.exports = {
    getMenu
};