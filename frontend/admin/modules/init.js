// frontend/admin/modules/init.js
import { initSectionsManager, loadSections } from './sections.js';
import { initPostsManager, loadPosts, populateSectionDropdown } from './posts.js';
import { initBlocksManager, loadContentBlocks } from './blocks.js';
import { initAppearanceManager, loadSettings } from './appearance.js';
import { initCommentsManager, loadCommentsForModeration } from './comments.js';
import { initSocialLinksManager, loadSocialLinks } from '../socialLinksManager.js';
import { initializeTabs, initializeThemeToggle } from './ui.js';
import { loadDashboardStats, loadDashboardCharts, refreshDashboardData } from './dashboard.js';
import { initUsersManager, loadUsers } from './users.js';
import { initBackupManager, loadBackups } from './backup.js';
import { initSeoManager, loadSeoSettings } from './seo.js';
import { initEmailSettingsManager, loadEmailSettings } from './emailSettings.js';
import { initCacheManager } from './cache.js';
import { initI18nManager, loadLanguages as loadI18nLanguages } from './i18n.js';
import { initAuth } from './auth.js';

/**
 * Inicializa todos los módulos de la interfaz de usuario y los manejadores de eventos.
 * Esta función se encarga de la configuración inicial de la UI.
 */
export function initializeAllModules() {
    initializeTabs();
    initializeThemeToggle();
    initAuth(); // Configura los listeners de login/logout.
    initSectionsManager();
    initAppearanceManager();
    initCommentsManager();
    initSocialLinksManager();
    initUsersManager();
    initBackupManager();
    initSeoManager();
    initEmailSettingsManager();    
    initCacheManager();
    initializeColorPickers(); // Configura los selectores de color.

    // Inicializar el botón de refresco del dashboard
    const refreshBtn = document.getElementById('refresh-dashboard-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboardData);
    }
}

/**
 * Carga todos los datos iniciales necesarios para el dashboard después de la autenticación.
 * Esta función se ejecuta solo si el usuario está autenticado.
 */
export async function loadInitialData() {
    try {
        // Primero cargamos los idiomas, ya que otros módulos dependen de ellos.
        const languages = await loadI18nLanguages();

        // Inicializamos los módulos que dependen de los idiomas.
        initPostsManager(languages);
        initBlocksManager(languages);
        initI18nManager(languages); // Pasamos los idiomas para evitar que los vuelva a cargar.

        await Promise.all([
            loadDashboardStats(),
            loadSections(),
            loadPosts(),
            loadCommentsForModeration(),
            populateSectionDropdown(languages),
            loadSettings(),
            loadContentBlocks(),
            loadSocialLinks(),
            loadUsers(),
            loadBackups(),
            loadSeoSettings(),
            loadEmailSettings()
        ]);
    } catch (error) {
        if (error.message !== 'Sesión expirada') {
            console.error("Fallo en la carga inicial de datos del dashboard:", error.message);
            alert("Hubo un error al cargar los datos del panel. Por favor, recarga la página.");
        }
    }
}

/**
 * Sincroniza un input de tipo 'color' con un input de tipo 'text' para mostrar el código hexadecimal.
 * @param {string} colorInputId - ID del input de color.
 * @param {string} hexInputId - ID del input de texto.
 */
function initializeColorPicker(colorInputId, hexInputId) {
    const colorInput = document.getElementById(colorInputId);
    const hexInput = document.getElementById(hexInputId);

    if (!colorInput || !hexInput) return;

    const syncColor = (from, to) => {
        to.value = from.value;
        // Establecemos una variable CSS en el input de texto. El CSS se encargará de usarla.
        hexInput.style.setProperty('--swatch-color', from.value);
    };

    colorInput.addEventListener('input', () => syncColor(colorInput, hexInput));
    hexInput.addEventListener('change', () => syncColor(hexInput, colorInput)); // Usamos 'change' para cuando se escribe el hex a mano

    syncColor(colorInput, hexInput); // Sincronización inicial
}

/**
 * Configura los selectores de color con sincronización de campo de texto.
 */
function initializeColorPickers() {
    initializeColorPicker('primary_color', 'primary_color_hex');
    initializeColorPicker('secondary_color', 'secondary_color_hex');
    initializeColorPicker('background_color', 'background_color_hex');
    initializeColorPicker('text_color', 'text_color_hex');
    initializeColorPicker('primary_color_dark', 'primary_color_dark_hex');
    initializeColorPicker('secondary_color_dark', 'secondary_color_dark_hex');
    initializeColorPicker('background_color_dark', 'background_color_dark_hex');
    initializeColorPicker('text_color_dark', 'text_color_dark_hex');
}

/**
 * Función principal de arranque del panel de administración.
 */
export async function bootstrapAdminPanel() {
    // Esta función ahora es llamada DESPUÉS de que checkAuth() tiene éxito.
    await loadInitialData();
    // Cargar los gráficos del dashboard la primera vez, ya que es la pestaña por defecto.
    loadDashboardCharts();
}