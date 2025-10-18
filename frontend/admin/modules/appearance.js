// frontend/admin/modules/appearance.js
import { settingsApi, sectionsApi } from '../api.js';
import { ASSET_BASE_URL } from '../../assets/js/main.js';

// --- DOM Element Cache ---
const heroSettingsForm = document.getElementById('hero-settings-form');
const settingsForm = document.getElementById('settings-form');
const logoUploadForm = document.getElementById('logo-upload-form');
const logoImageInput = document.getElementById('logoFile');
const heroImageUploadForm = document.getElementById('hero-image-upload-form');
const heroImageInput = document.getElementById('heroImageFile');
const restoreBtn = document.getElementById('restore-settings-btn');
const logoPreview = document.getElementById('logo-preview');
const noLogoText = document.getElementById('no-logo-text');
const heroPreview = document.getElementById('hero-image-preview');
const noHeroText = document.getElementById('no-hero-text');
const heroCtaLinkSelect = document.getElementById('hero_cta_link');
const heroCtaLinkCustomInput = document.getElementById('hero_cta_link_custom');

// Variable para almacenar el estado inicial de la configuración
export let initialSettings = {};

/**
 * Carga la configuración actual del sitio en los formularios.
 */
export async function loadSettings() {
    if (!settingsForm) return;
    try {
        const settings = await settingsApi.get();
        initialSettings = { ...settings }; // Guardar una copia del estado inicial

        // Cargar logo
        if (logoPreview && noLogoText) {
            if (settings.site_logo) {
                // Usar la URL base de assets para construir la ruta de la imagen
                logoPreview.src = `${ASSET_BASE_URL}${settings.site_logo}?t=${new Date().getTime()}`; // Cache-busting
                logoPreview.style.display = 'block';
                noLogoText.style.display = 'none';
            } else {
                logoPreview.style.display = 'none';
                noLogoText.style.display = 'block';
            }
        }

        // Cargar imagen de hero
        if (heroPreview && noHeroText) {
            if (settings.hero_background_image) {
                // Usar la URL base de assets para construir la ruta de la imagen
                const imageUrl = `${ASSET_BASE_URL}${settings.hero_background_image}?t=${new Date().getTime()}`;
                heroPreview.innerHTML = `<img src="${imageUrl}" alt="Vista previa de la imagen Hero" style="max-width: 100%; height: auto; border-radius: 8px;">`;
                noHeroText.style.display = 'none';
            } else {
                heroPreview.innerHTML = '';
                noHeroText.style.display = 'block';
            }
        }

        // Asignar valores a los inputs del formulario
        Object.keys(settings).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                // CASO ESPECIAL: El dropdown del Hero se maneja por separado para evitar conflictos.
                if (key === 'hero_cta_link') {
                    return; // No hacer nada aquí, se maneja después.
                }
                input.value = settings[key];

                // Disparar evento para sincronizar color-pickers y hex-inputs
                if (input.type === 'color') {
                    input.dispatchEvent(new Event('input'));
                }
            }
        });

        // Manejar el dropdown del Hero después de que todos los demás campos se hayan llenado.
        await populateHeroCtaLinkDropdown(settings.hero_cta_link);

    } catch (error) {
        alert(`Error al cargar la configuración: ${error.message}`);
    }
}

/**
 * Inicializa los manejadores de eventos para la gestión de la apariencia.
 */
export function initAppearanceManager() {
    if (heroSettingsForm) {
        heroSettingsForm.addEventListener('submit', handleUpdateSettings);
    }
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleUpdateSettings);
    }
    if (logoUploadForm) {
        logoUploadForm.addEventListener('submit', handleUploadLogo);
    }
    if (logoImageInput) {
        logoImageInput.addEventListener('change', previewLogoImage);
    }
    if (heroImageUploadForm) {
        heroImageUploadForm.addEventListener('submit', handleUploadHeroImage);
    }
    if (heroImageInput) {
        heroImageInput.addEventListener('change', previewHeroImage);
    }
    if (heroCtaLinkSelect) {
        heroCtaLinkSelect.addEventListener('change', handleHeroCtaLinkChange);
    }
    if (restoreBtn) {
        restoreBtn.addEventListener('click', handleRestoreDefaults);
    }
}

// --- Funciones de Ayuda (Helpers) ---

/**
 * Manejador unificado para guardar la configuración desde cualquier formulario.
 * Determina qué formulario se envió y recopila los datos correspondientes.
 * @param {Event} e - El evento de submit.
 */
async function handleUpdateSettings(e) {
    e.preventDefault();
    // Determinar qué formulario disparó el evento
    const form = e.target;
    const formData = new FormData(form);
    let settingsToUpdate = {};

    // Recopilar datos del formulario que se envió
    for (const [key, value] of formData.entries()) {
        // Filtrar para no enviar los campos de ayuda `_hex`
        // Y MUY IMPORTANTE: filtrar los campos de tipo File, ya que se manejan en sus propios formularios.
        const inputElement = form.querySelector(`[name="${key}"]`);
        if (!key.endsWith('_hex') && inputElement?.type !== 'file') {
            settingsToUpdate[key] = value;
        }
    }

    // Comprobar si ha habido cambios comparando con el estado inicial
    const hasChanges = Object.keys(settingsToUpdate).some(key => initialSettings[key] !== settingsToUpdate[key]);

    if (!hasChanges) {
        alert('No se ha realizado ningún cambio en la configuración.');
        return;
    }

    // Manejo especial para el enlace del CTA del Hero
    if (settingsToUpdate.hero_cta_link === 'custom_url') {
        settingsToUpdate.hero_cta_link = heroCtaLinkCustomInput.value;
    } else {
        // Si el campo existe pero no es 'custom_url', nos aseguramos de que el input custom esté limpio
        if (form.id === 'hero-settings-form') {
            heroCtaLinkCustomInput.value = '';
        }
    }
    try {
        await settingsApi.update(settingsToUpdate);
        alert('¡Configuración guardada con éxito!');
        // Actualizar el estado inicial con los nuevos valores guardados
        initialSettings = { ...initialSettings, ...settingsToUpdate };
    } catch (error) {
        alert(error.message);
    }
}

async function handleUploadLogo(e) {
    e.preventDefault();
    const formData = new FormData(logoUploadForm);
    if (!formData.get('logoFile') || !formData.get('logoFile').size) {
        alert('Por favor, selecciona un archivo de imagen.');
        return;
    }
    try {
        const response = await settingsApi.uploadLogo(formData);
        alert('Logo actualizado con éxito.');
        loadSettings(); // Recargar para mostrar el nuevo logo
    } catch (error) {
        alert(error.message);
    }
}

async function handleUploadHeroImage(e) {
    e.preventDefault();
    const formData = new FormData(heroImageUploadForm);
    if (!formData.get('heroImageFile') || !formData.get('heroImageFile').size) {
        alert('Por favor, selecciona un archivo de imagen.');
        return;
    }
    try {
        const response = await settingsApi.uploadHeroImage(formData);
        alert('Imagen de Hero actualizada con éxito.');
        loadSettings(); // Recargar para mostrar la nueva imagen
    } catch (error) {
        alert(error.message);
    }
}

async function handleRestoreDefaults() {
    if (!confirm('¿Estás seguro de que quieres restaurar todos los estilos a sus valores por defecto?')) return;
    try {
        await settingsApi.restore();
        alert('Estilos restaurados con éxito.');
        loadSettings(); // Recargar los estilos en el formulario
    } catch (error) {
        alert('Error al restaurar los estilos.');
    }
}

/**
 * Obtiene las secciones y las carga en el menú desplegable del enlace del Hero.
 * @param {string} currentValue - El valor actual guardado para el enlace, para pre-seleccionarlo.
 */
async function populateHeroCtaLinkDropdown(currentValue = '') {
    if (!heroCtaLinkSelect) return;

    try {
        const sections = await sectionsApi.getAll();
        
        // Limpiar opciones existentes
        heroCtaLinkSelect.innerHTML = '';

        // Añadir opciones por defecto
        heroCtaLinkSelect.innerHTML += `
            <option value="/">Página de Inicio</option>
            <option value="custom_url">-- URL Personalizada --</option>
        `;

        // Añadir una opción por cada sección
        sections.forEach(section => {
            const option = document.createElement('option');
            option.value = `/section/${section.slug}`;
            option.textContent = `Sección: ${section.name}`;
            heroCtaLinkSelect.appendChild(option);
        });

        // Intentar seleccionar el valor actual
        const optionExists = Array.from(heroCtaLinkSelect.options).some(opt => opt.value === currentValue);
        
        if (optionExists) {
            heroCtaLinkSelect.value = currentValue;
        } else if (currentValue) {
            // Si el valor guardado no está en las opciones, es una URL personalizada
            heroCtaLinkSelect.value = 'custom_url';
            heroCtaLinkCustomInput.value = currentValue;
            heroCtaLinkCustomInput.style.display = 'block';
        }

    } catch (error) {
        console.error('Error al cargar secciones para el dropdown del Hero:', error);
    }
}

function handleHeroCtaLinkChange() {
    if (heroCtaLinkSelect.value === 'custom_url') {
        heroCtaLinkCustomInput.style.display = 'block';
    } else {
        heroCtaLinkCustomInput.style.display = 'none';
        heroCtaLinkCustomInput.value = ''; // Limpiar por si acaso
    }
}

/**
 * Muestra una vista previa de la imagen de fondo del Hero seleccionada por el usuario.
 */
function previewHeroImage() {
    if (!heroImageInput.files || !heroImageInput.files[0]) {
        return; // No hacer nada si no hay archivo
    }

    const file = heroImageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        heroPreview.innerHTML = `<img src="${e.target.result}" alt="Vista previa de la imagen Hero" style="max-width: 100%; height: auto; border-radius: 8px;">`;
        noHeroText.style.display = 'none';
    }

    reader.readAsDataURL(file);
}

/**
 * Muestra una vista previa del logo del sitio seleccionado por el usuario.
 */
function previewLogoImage() {
    if (!logoImageInput.files || !logoImageInput.files[0]) {
        return; // No hacer nada si no hay archivo
    }

    const file = logoImageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        logoPreview.src = e.target.result;
        logoPreview.style.display = 'block';
        noLogoText.style.display = 'none';
    }

    reader.readAsDataURL(file);
}