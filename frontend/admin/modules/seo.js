// frontend/admin/modules/seo.js
import { settingsApi, seoApi } from '../api.js';
import { initialSettings } from './appearance.js'; // Importar el estado inicial

const seoForm = document.getElementById('seo-settings-form');
const generateSitemapBtn = document.getElementById('generate-sitemap-btn');

/**
 * Carga la configuración SEO en el formulario.
 * Los ajustes SEO se guardan en la tabla site_settings.
 */
export async function loadSeoSettings() {
    if (!seoForm) return;
    try {
        const settings = await settingsApi.get();
        document.getElementById('seo_meta_title').value = settings.seo_meta_title || '';
        document.getElementById('seo_meta_description').value = settings.seo_meta_description || '';
    } catch (error) {
        console.error('Error al cargar la configuración SEO:', error);
    }
}

async function handleSaveSeoSettings(e) {
    e.preventDefault();
    const settings = {
        seo_meta_title: document.getElementById('seo_meta_title').value,
        seo_meta_description: document.getElementById('seo_meta_description').value,
    };

    // Comprobar si ha habido cambios comparando con el estado inicial
    const hasChanges = Object.keys(settings).some(key => initialSettings[key] !== settings[key]);

    if (!hasChanges) {
        alert('No se ha realizado ningún cambio en la configuración SEO.');
        return;
    }

    try {
        await settingsApi.update(settings);
        alert('Configuración SEO guardada con éxito.');
    } catch (error) {
        alert(error.message);
    }
}

async function handleGenerateSitemap() {
    generateSitemapBtn.disabled = true;
    generateSitemapBtn.textContent = 'Generando...';
    try {
        const result = await seoApi.generateSitemap();
        alert(result.message);
    } catch (error) {
        alert(error.message);
    } finally {
        generateSitemapBtn.disabled = false;
        generateSitemapBtn.textContent = 'Generar/Actualizar Sitemap';
    }
}

export function initSeoManager() {
    if (seoForm) seoForm.addEventListener('submit', handleSaveSeoSettings);
    if (generateSitemapBtn) generateSitemapBtn.addEventListener('click', handleGenerateSitemap);
}