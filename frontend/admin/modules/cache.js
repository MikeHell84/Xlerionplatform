// frontend/admin/modules/cache.js
import { cacheApi } from '../api.js';

const clearAllBtn = document.getElementById('clear-all-cache-btn');
const clearMenuBtn = document.getElementById('clear-menu-cache-btn');
const clearSettingsBtn = document.getElementById('clear-settings-cache-btn');
const clearContentBtn = document.getElementById('clear-content-cache-btn');
const cacheStatus = document.getElementById('cache-status');

async function handleClearAllCache() {
    if (!confirm('¿Estás seguro de que quieres limpiar TODA la caché del sitio?')) return;
    try {
        const result = await cacheApi.clearAll();
        cacheStatus.textContent = result.message;
        alert(result.message);
    } catch (error) {
        alert(error.message);
    }
}

async function handleClearSpecificCache(prefixes, button) {
    const originalText = button.textContent;
    button.disabled = true;
    button.textContent = 'Limpiando...';
    try {
        const result = await cacheApi.clearSpecific(prefixes);
        cacheStatus.textContent = result.message;
        alert(result.message);
    } catch (error) {
        alert(error.message);
    } finally {
        button.disabled = false;
        button.textContent = originalText;
    }
}

export function initCacheManager() {
    if (!clearAllBtn) return;

    clearAllBtn.addEventListener('click', handleClearAllCache);
    clearMenuBtn.addEventListener('click', (e) => handleClearSpecificCache(['menu_'], e.target));
    clearSettingsBtn.addEventListener('click', (e) => handleClearSpecificCache(['site_settings'], e.target));
    // Limpia la caché de secciones, posts y bloques de contenido
    clearContentBtn.addEventListener('click', (e) => handleClearSpecificCache(['section_', 'post_', 'content_blocks'], e.target));
}