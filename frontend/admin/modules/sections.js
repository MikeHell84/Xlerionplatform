// frontend/admin/modules/sections.js
import { sectionsApi } from '../api.js';

const sectionsGrid = document.getElementById('sections-grid');
const menuPreview = document.getElementById('menu-preview');

/**
 * Carga y muestra la vista previa del menú principal en el panel de admin.
 */
async function loadMenuPreview() {
    if (!menuPreview) return;
    try {
        const sections = await sectionsApi.getAll();
        const activeSections = sections.filter(s => s.status === 'active');
        
        if (activeSections.length > 0) {
            menuPreview.innerHTML = `<ul>${activeSections.map(s => `<li>${s.name}</li>`).join('')}</ul>`;
        } else {
            menuPreview.innerHTML = '<p>No hay secciones activas para mostrar en el menú.</p>';
        }
    } catch (error) {
        menuPreview.innerHTML = `<p class="error-message">Error al cargar la vista previa del menú: ${error.message}</p>`;
    }
}

/**
 * Carga las secciones desde el backend y las renderiza.
 */
export async function loadSections() {
    if (!sectionsGrid) return;
    const suggestedSections = [
        'Inicio', 'Servicios', 'Proyectos', 'Blog', 'Testimonios', 'Galería', 'Contacto', 'Sobre Nosotros',
        'Preguntas Frecuentes', 'Equipo', 'Eventos', 'Recursos', 'Descargas', 'IA Asistente', 'Panel de Control',
        'Portafolio', 'Clientes', 'Noticias', 'Integraciones', 'Personalización Visual', 'Resumen Inteligente',
        'Preguntas y Respuestas', 'Tutoriales', 'Comunidad', 'Soporte Técnico', 'Documentación', 'Registro de Actividad',
        'Estadísticas', 'Configuración', 'Marketplace', 'Catálogo', 'Agenda', 'Enlaces Útiles', 'Mapa del Sitio',
        'Mensajes', 'Notificaciones', 'Encuestas', 'Formularios', 'Integración con IA', 'Panel de Usuario'
    ];
    try {
        const existingSections = await sectionsApi.getAll();
        const existingSectionMap = new Map(existingSections.map(s => [s.name, s]));
        const cardHTML = suggestedSections.map(name => {
            const slug = name.toLowerCase().replace(/ /g, '-');
            const existing = existingSectionMap.get(name);
            return `
            <div class="section-card" data-section-id="${existing?.id || ''}" data-section-name="${name}" data-section-slug="${slug}">
                <h4>${name}</h4>
                <div class="form-group">
                    <label>Icono (Clase de Font Awesome)</label>
                    <input type="text" class="section-icon" value="${existing?.icon || ''}" placeholder="ej: fas fa-home">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea class="section-description" rows="2">${existing?.description || ''}</textarea>
                </div>
                <div class="section-card-footer">
                    <div class="status-toggle">
                        <label>Activo</label>
                        <label class="theme-switch">
                            <input type="checkbox" class="section-toggle" ${existing && existing.status === 'active' ? 'checked' : ''}>
                            <div class="slider round"></div>
                        </label>
                    </div>
                    <button class="save-section-btn">Guardar</button>
                </div>
            </div>
            `;
        }).join('');
        sectionsGrid.innerHTML = cardHTML;
    } catch (error) {
        sectionsGrid.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
}

async function handleSaveSection(cardElement) {
    const id = cardElement.dataset.sectionId;
    const name = cardElement.dataset.sectionName;
    const slug = cardElement.dataset.sectionSlug;
    const icon = cardElement.querySelector('.section-icon').value;
    const description = cardElement.querySelector('.section-description').value;
    const status = cardElement.querySelector('.section-toggle').checked ? 'active' : 'inactive';

    const isUpdating = id !== '';
    try {
        await sectionsApi.save(id, { name, slug, icon, description, status });
        alert(`Sección "${name}" guardada con éxito.`);        
        // Si no es una actualización (es una creación), recargamos toda la lista para obtener el nuevo ID.
        if (!isUpdating) {
            await loadSections();
        }
        // Siempre actualizamos la vista previa del menú.
        await loadMenuPreview();
    } catch (error) {
        alert(`Error al guardar la sección: ${error.message}`);
    }
}

/**
 * Inicializa los manejadores de eventos para la gestión de secciones.
 */
export function initSectionsManager() {
    if (!sectionsGrid) return;

    sectionsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('save-section-btn')) {
            handleSaveSection(e.target.closest('.section-card'));
        }
    });

    // Cargar la vista previa del menú al iniciar la pestaña.
    loadMenuPreview();
}