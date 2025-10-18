// backend/services/socialLinkService.js

const mockSocialLinks = [
    { id: 1, name: 'Facebook', url: 'https://facebook.com', icon: 'fab fa-facebook' },
    { id: 2, name: 'Twitter', url: 'https://twitter.com', icon: 'fab fa-twitter' },
    { id: 3, name: 'Instagram', url: 'https://instagram.com', icon: 'fab fa-instagram' }
];

/**
 * @desc    Obtiene los enlaces a redes sociales.
 * @returns {Promise<object[]>} Un array de enlaces sociales.
 */
const getSocialLinks = async () => {
    return Promise.resolve(mockSocialLinks);
};

module.exports = {
    getSocialLinks
};