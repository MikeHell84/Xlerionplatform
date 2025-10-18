// backend/services/postService.js

const mockPosts = [
    { id: 1, title: 'Página de Inicio', slug: 'inicio', content: '<h1>Bienvenido a la Página Principal</h1><p>Este es el contenido de la home.</p>' },
    { id: 2, title: 'Sobre Nosotros', slug: 'sobre-nosotros', content: '<h1>Nuestra Historia</h1><p>Somos una empresa con una rica historia...</p>' },
    { id: 3, title: 'Contacto', slug: 'contacto', content: '<h1>Contáctanos</h1><p>Puedes encontrarnos en...</p>' }
];

/**
 * @desc    Encuentra un post por su slug.
 * @param   {string} slug El slug del post a buscar.
 * @returns {Promise<object|null>} El objeto del post o null si no se encuentra.
 */
const findPostBySlug = async (slug) => {
    // Simula una búsqueda en la base de datos.
    const post = mockPosts.find(p => p.slug === slug);
    return Promise.resolve(post || null);
};

module.exports = {
    findPostBySlug
};