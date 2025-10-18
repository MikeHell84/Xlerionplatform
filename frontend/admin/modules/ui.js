// frontend/admin/modules/ui.js
import { loadDashboardCharts } from './dashboard.js';

/**
 * Inicializa la lógica para la navegación por pestañas.
 */
function initializeTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            link.classList.add('active');
            const targetPane = document.querySelector(link.getAttribute('href'));
            if (targetPane) targetPane.classList.add('active');

            // Cargar gráficos del dashboard solo cuando la pestaña esté visible
            if (link.getAttribute('href') === '#tab-dashboard') {
                loadDashboardCharts();
            }
        });
    });
}

/**
 * Inicializa el interruptor de tema (modo oscuro/claro).
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-checkbox');
    if (!themeToggle) return;

    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
}

/**
 * Inicializa la sincronización de doble vía para un grupo de selector de color.
 * @param {string} colorInputId - El ID del input de tipo 'color'.
 * @param {string} hexInputId - El ID del input de tipo 'text' para el código hexadecimal.
 */
function initializeColorPicker(colorInputId, hexInputId) {
    const colorInput = document.getElementById(colorInputId);
    const hexInput = document.getElementById(hexInputId);
    if (!colorInput || !hexInput) return;

    colorInput.addEventListener('input', () => { hexInput.value = colorInput.value; });
    hexInput.addEventListener('input', () => {
        if (/^#([0-9A-F]{3}){1,2}$/i.test(hexInput.value)) {
            colorInput.value = hexInput.value;
            colorInput.dispatchEvent(new Event('input'));
        }
    });
}

export { initializeTabs, initializeThemeToggle, initializeColorPicker };