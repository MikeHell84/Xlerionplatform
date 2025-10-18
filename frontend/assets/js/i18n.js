// frontend/assets/js/i18n.js

let translations = {};
let currentLanguage = 'es'; // Idioma por defecto

/**
 * Carga las traducciones para un idioma específico desde la API.
 * @param {string} lang - El código del idioma (ej. 'es', 'en').
 */
async function fetchTranslations(lang) {
    try {
        const response = await fetch(`http://localhost:3000/api/public/i18n/translations/${lang}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'No se pudieron cargar las traducciones.');
        }
        translations = data;
        applyTranslations();
    } catch (error) {
        console.error('Error en fetchTranslations:', error.message);
    }
}

/**
 * Aplica las traducciones cargadas a todos los elementos con el atributo data-i18n-key.
 */
function applyTranslations() {
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.getAttribute('data-i18n-key');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

/**
 * Cambia el idioma actual, guarda la preferencia y recarga las traducciones.
 * @param {string} lang - El nuevo código de idioma.
 */
async function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    document.documentElement.lang = lang;
    await fetchTranslations(lang);
}

/**
 * Inicializa el sistema de internacionalización.
 */
export async function initI18n() {
    const languageSelect = document.getElementById('language-select');
    
    // Obtener idiomas disponibles (simulado por ahora, podría venir de una API)
    const availableLanguages = [
        { code: 'es', name: 'Español' },
        { code: 'en', name: 'English' }
    ];

    // Poblar el selector de idiomas
    availableLanguages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        languageSelect.appendChild(option);
    });

    // Detectar idioma preferido
    const preferredLanguage = localStorage.getItem('preferredLanguage') || navigator.language.split('-')[0];
    currentLanguage = availableLanguages.some(l => l.code === preferredLanguage) ? preferredLanguage : 'es';

    languageSelect.value = currentLanguage;

    // Añadir listener para cambiar de idioma
    languageSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

    // Cargar las traducciones iniciales
    await setLanguage(currentLanguage);
}